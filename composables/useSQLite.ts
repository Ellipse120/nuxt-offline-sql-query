import type { DbId } from "@sqlite.org/sqlite-wasm";
import { sqlite3Worker1Promiser } from "@sqlite.org/sqlite-wasm";

const databaseConfig = {
  filename: "file:mydb.sqlite3?vfs=opfs",
  tables: {
    test: {
      name: "test_table",
      schema: `
        CREATE TABLE IF NOT EXISTS test_table (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,
    },
  },
} as const;

export function useSQLite(dbPath = '') {
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  const isInitialized = ref(false);

  let promiser: ReturnType<typeof sqlite3Worker1Promiser> | null = null;
  let dbId: string | null = null;

  async function initialize() {
    if (isInitialized.value) return true;

    isLoading.value = true;
    error.value = null;

    try {
      // Initialize the SQLite worker
      promiser = await sqlite3Worker1Promiser.v2()

      if (!promiser) throw new Error("Failed to initialize promiser");

      // Get configuration and open database
      await promiser("config-get", {});
      const openResponse = await promiser("open", {
        filename: dbPath || databaseConfig.filename,
      });

      if (openResponse.type === "error") {
        throw new Error(openResponse.result.message);
      }

      dbId = openResponse.result.dbId as string;

      await promiser("exec", {
        dbId,
        sql: databaseConfig.tables.test.schema,
      });

      isInitialized.value = true;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("Unknown error");
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  }

  async function executeQuery(sql: string, params: unknown[] = []) {
    if (!dbId || !promiser) {
      await initialize();
    }

    isLoading.value = true;
    error.value = null;

    try {
      const result = await promiser!("exec", {
        dbId: dbId as DbId,
        sql,
        bind: params,
        returnValue: "resultRows",
      });

      if (result.type === "error") {
        throw new Error(result.result.message);
      }

      return result;
    } catch (err) {
      error.value =
        err instanceof Error ? err : new Error("Query execution failed");
      throw error.value;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    isInitialized,
    execQuery: executeQuery,
  };
}
