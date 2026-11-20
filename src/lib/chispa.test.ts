import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  maybeSingle: vi.fn(),
  insert: vi.fn(),
  update: vi.fn(() => ({ eq: vi.fn().mockResolvedValue({ error: null }) })),
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: mocks.maybeSingle }) }),
      insert: mocks.insert,
      update: mocks.update,
    }),
  },
}));

import { actualizarRacha, formatearTiempo, hoyISO } from "./chispa";

const dia = (diasAtras = 0) => hoyISO(new Date(Date.now() - diasAtras * 86_400_000));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.insert.mockResolvedValue({ error: null });
  mocks.maybeSingle.mockResolvedValue({ data: null });
});

describe("hoyISO", () => {
  it("usa la fecha local del usuario, no UTC", () => {
    expect(hoyISO(new Date(2026, 0, 5, 23, 30))).toBe("2026-01-05");
    expect(hoyISO(new Date(2026, 0, 6, 0, 30))).toBe("2026-01-06");
  });
});

describe("formatearTiempo", () => {
  it("muestra minutos y segundos y no deja valores negativos", () => {
    expect(formatearTiempo(125)).toBe("02:05");
    expect(formatearTiempo(-5)).toBe("00:00");
  });
});

describe("actualizarRacha", () => {
  it("crea la racha en 1 cuando es el primer guardado", async () => {
    const resultado = await actualizarRacha("u1");

    expect(mocks.insert).toHaveBeenCalledWith({
      user_id: "u1",
      current_streak: 1,
      longest_streak: 1,
      last_study_date: dia(),
    });
    expect(resultado).toEqual({ current: 1, rota: false });
  });

  it("no cambia nada si el usuario ya guardó hoy", async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: { current_streak: 4, longest_streak: 9, last_study_date: dia() },
    });

    const resultado = await actualizarRacha("u1");

    expect(mocks.insert).not.toHaveBeenCalled();
    expect(mocks.update).not.toHaveBeenCalled();
    expect(resultado).toEqual({ current: 4, rota: false });
  });

  it("suma uno si el último guardado fue ayer y conserva la máxima", async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: { current_streak: 4, longest_streak: 9, last_study_date: dia(1) },
    });

    const resultado = await actualizarRacha("u1");

    expect(mocks.update).toHaveBeenCalledWith({
      current_streak: 5,
      longest_streak: 9,
      last_study_date: dia(),
    });
    expect(resultado).toEqual({ current: 5, rota: false });
  });

  it("reinicia en 1 y marca rotura si faltó más de un día", async () => {
    mocks.maybeSingle.mockResolvedValue({
      data: { current_streak: 4, longest_streak: 9, last_study_date: dia(3) },
    });

    const resultado = await actualizarRacha("u1");

    expect(mocks.update).toHaveBeenCalledWith({
      current_streak: 1,
      longest_streak: 9,
      last_study_date: dia(),
    });
    expect(resultado).toEqual({ current: 1, rota: true });
  });
});
