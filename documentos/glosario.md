# Glosario

| Término | Significado |
|---|---|
| **Sesión de estudio** | Registro de un usuario estudiando un tema: duración, explicación y fecha.Tabla `study_sessions`. |
| **Sesión activa** | Estado del cronómetro en curso. Vive en `SesionActivaProvider` y se persiste en `localStorage` bajo `chispa-sesion-activa`. |
| **Tema** | Contenido a estudiar. Puede ser curado, generado por IA o creado por el usuario. Tabla `topics`. |
| **Tema del día** | Tema común para todos los usuarios en un día. |
| **Explicación** | Texto (escrito o transcrito) con el que el usuario demuestra lo aprendido. Siempre editable antes de guardar. |
| **Racha** | Días consecutivos con al menos una sesión. `current_streak` / `longest_streak`. |
| **Logro** | Reconocimiento desbloqueado al cumplir una regla sobre estadísticas. Tablas `achievements` / `user_achievements`. |
| **Etiqueta** | Categoría de un tema (historia, matemática, ciencia, etc.). Tablas `tags` / `topic_tags`. |
| **Grafo de temas** | Visualización de temas como nodos y sus relaciones como enlaces. |
| **Enlace automático** | Relación calculada en cliente por materia compartida, etiquetas comunes o palabras clave. No se guarda. |
| **Enlace manual** | Relación creada explícitamente por el usuario. Se guarda en `topic_links` con `kind = 'manual'`. |
| **Enlace ignorado** | Par que el usuario marcó como "no relacionado". Suprime el enlace automático. `kind = 'ignorada'`. |
| **Clave de par** | Identificador ordenado de dos temas (`a|b`) para que `(A,B)` y `(B,A)` sean el mismo enlace. |
| **Perfil** | Datos públicos del usuario: avatar/skin, nombre y estadísticas. |
| **Reporte** | Señalamiento de una explicación pública problemática. |
| **Fuente de verdad** | `SPEC.md`. Si el código y el SPEC discrepan, se corrige el código (o se actualiza el SPEC con decisión previa). |
