# How to Add New Curricula

To add a new program or class to the platform, follow these steps:

1.  **Create a New File**
    Create a new TypeScript file in `lib/curricula/` (e.g., `lib/curricula/my-new-program.ts`).

2.  **Define the Program**
    Export a `Program` object. You can copy the structure from `lib/curricula/programs.ts`.
    Required fields:
    - `id`: Unique string ID
    - `slug`: URL-friendly slug
    - `name`: Display name
    - `description`: Short description
    - `totalSessions`: Number of sessions
    - `sessions`: Array of session objects

3.  **Export the Program**
    Add your new program to the main export in `lib/curricula/index.ts`.
    ```typescript
    import { myNewProgram } from './my-new-program';
    // ...
    export const curriculaPrograms = [
      ...existingPrograms,
      myNewProgram
    ];
    ```

4.  **Verify**
    The app uses `lib/mock-data.ts` which imports `curriculaPrograms`. Your new program should appear automatically in the Admin Program Library.
