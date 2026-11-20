import { describe, expect, it, vi } from "vitest";

// calcularEnlaces es puro; el cliente de Supabase solo se usa en cargarDatosGrafo.
vi.mock("@/integrations/supabase/client", () => ({ supabase: {} }));

import { calcularEnlaces, clavePar, type ConexionGuardada, type NodoTema } from "./grafo";

const nodo = (id: string, materia: string, tags: string[], palabras: string[]): NodoTema => ({
  id,
  titulo: id,
  icon: "",
  materia,
  tags,
  sesionId: `sesion-${id}`,
  palabras: new Set(palabras),
  grado: 0,
});

describe("clavePar", () => {
  it("identifica (A,B) y (B,A) como el mismo enlace", () => {
    expect(clavePar("a", "b")).toBe(clavePar("b", "a"));
    expect(clavePar("b", "a")).toBe("a|b");
  });
});

describe("calcularEnlaces", () => {
  it("suma 3 por materia compartida (RN-28)", () => {
    const enlaces = calcularEnlaces(
      [nodo("a", "Historia", [], []), nodo("b", "Historia", [], [])],
      [],
    );
    expect(enlaces).toHaveLength(1);
    expect(enlaces[0]!.fuerza).toBe(3);
    expect(enlaces[0]!.manual).toBe(false);
  });

  it("no crea enlace cuando no hay materia, etiquetas ni palabras comunes", () => {
    const enlaces = calcularEnlaces(
      [nodo("a", "Historia", ["roma"], ["imperio"]), nodo("b", "Biologia", ["celula"], ["adn"])],
      [],
    );
    expect(enlaces).toEqual([]);
  });

  it("suma etiquetas compartidas y palabras en común con tope", () => {
    const enlaces = calcularEnlaces(
      [
        nodo("a", "Historia", ["roma", "antigua", "guerra"], ["imperio", "legion", "senado"]),
        nodo("b", "Historia", ["roma", "antigua", "guerra"], ["imperio", "legion", "senado"]),
      ],
      [],
    );
    // 3 (materia) + 4 (etiquetas, tope) + 1 (3 palabras / 2, tope 3)
    expect(enlaces[0]!.fuerza).toBe(8);
  });

  it("un enlace ignorado suprime el automático (RN-30)", () => {
    const conexiones: ConexionGuardada[] = [
      { id: "l1", topic_a: "b", topic_b: "a", kind: "ignorada", label: null, strength: 0 },
    ];
    const enlaces = calcularEnlaces(
      [nodo("a", "Historia", [], []), nodo("b", "Historia", [], [])],
      conexiones,
    );
    expect(enlaces).toEqual([]);
  });

  it("un enlace manual se conserva y suma su fuerza (RN-30)", () => {
    const conexiones: ConexionGuardada[] = [
      { id: "l2", topic_a: "a", topic_b: "b", kind: "manual", label: "Relación", strength: 5 },
    ];
    const enlaces = calcularEnlaces(
      [nodo("a", "Historia", [], []), nodo("b", "Historia", [], [])],
      conexiones,
    );
    expect(enlaces).toHaveLength(1);
    expect(enlaces[0]!.manual).toBe(true);
    expect(enlaces[0]!.fuerza).toBe(8);
    expect(enlaces[0]!.label).toBe("Relación");
  });

  it("ignora enlaces guardados que apuntan a temas inexistentes", () => {
    const conexiones: ConexionGuardada[] = [
      { id: "l3", topic_a: "a", topic_b: "fantasma", kind: "manual", label: null, strength: 5 },
    ];
    const enlaces = calcularEnlaces([nodo("a", "Historia", [], [])], conexiones);
    expect(enlaces).toEqual([]);
  });
});
