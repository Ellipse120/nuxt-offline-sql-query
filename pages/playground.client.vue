<script setup lang="ts">
const { isLoading, error, execQuery } = useSQLite();
const sqlQuery = ref("SELECT * FROM test_table");
const queryResult = ref<any[]>([]);
const queryError = ref<string | null>(null);

// Predefined example queries for testing
const exampleQueries = [
  { title: "Select all", query: "SELECT * FROM test_table" },
  {
    title: "Insert",
    query: "INSERT INTO test_table (name) VALUES ('New Test Item')",
  },
  {
    title: "Update",
    query: "UPDATE test_table SET name = 'Updated Item' WHERE name LIKE 'New%'",
  },
  {
    title: "Delete",
    query: "DELETE FROM test_table WHERE name = 'Updated Item'",
  },
];

async function runQuery() {
  queryError.value = null;
  queryResult.value = [];

  try {
    const result = await execQuery(sqlQuery.value);
    const isSelect = sqlQuery.value.trim().toLowerCase().startsWith("select");

    console.log(result);

    if (isSelect) {
      queryResult.value = result?.result.resultRows || [];
    } else {
      // After mutation, fetch updated data
      queryResult.value =
        (await execQuery("SELECT * FROM test_table"))?.result.resultRows || [];
    }
  } catch (err) {
    queryError.value = err instanceof Error ? err.message : "An error occurred";
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <h2 class="text-2xl font-bold">SQLite Playground</h2>

    <!-- Example queries -->
    <div class="mt-4">
      <h3 class="text-sm font-medium">Example Queries:</h3>
      <div class="flex gap-2 mt-2">
        <button
          v-for="example in exampleQueries"
          :key="example.title"
          class="px-3 py-1 text-sm rounded-full bg-gray-100 hover:bg-gray-200"
          @click="sqlQuery = example.query"
        >
          {{ example.title }}
        </button>
      </div>
    </div>

    <!-- Query input -->
    <div class="mt-6">
      <textarea
        v-model="sqlQuery"
        rows="4"
        class="w-full px-4 py-3 rounded-lg font-mono text-sm border"
        :disabled="isLoading"
      />
      <button
        :disabled="isLoading"
        class="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
        @click="runQuery"
      >
        {{ isLoading ? "Running..." : "Run Query" }}
      </button>
    </div>

    <!-- Error display -->
    <div
      v-if="error || queryError"
      class="mt-4 p-4 rounded-lg bg-red-50 text-red-600"
    >
      {{ error?.message || queryError }}
    </div>

    <!-- Results table -->
    <div v-if="queryResult.length" class="mt-4">
      <h3 class="text-lg font-semibold">Results:</h3>
      <div class="mt-2 overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th
                v-for="column in Object.keys(queryResult[0])"
                :key="column"
                class="px-4 py-2 text-left"
              >
                {{ column }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in queryResult" :key="index">
              <td
                v-for="column in Object.keys(row)"
                :key="column"
                class="px-4 py-2"
              >
                {{ row[column] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
