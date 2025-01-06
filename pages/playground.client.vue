<script setup lang="ts">
const { isLoading, error, execQuery } = useSQLite();
const sqlQuery = ref("SELECT * FROM test_table");
const queryResult = ref<any[]>([]);
const queryError = ref<string | null>(null);
const consumingTime = ref<number | null>(null)

type exampleType = {
  title: string;
  query: string;
  variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
};

const exampleQueries: exampleType[] = [
  {
    title: "Select all",
    query: "SELECT * FROM test_table",
    variant: "default",
  },
  {
    title: "Insert",
    query: "INSERT INTO test_table (name) VALUES ('New Test Item')",
    variant: "secondary",
  },
  {
    title: "Update",
    query: "UPDATE test_table SET name = 'Updated Item' WHERE name LIKE 'New%'",
    variant: "outline",
  },
  {
    title: "Delete",
    query: "DELETE FROM test_table WHERE name = 'Updated Item'",
    variant: "destructive",
  },
];

async function runQuery() {
  queryError.value = null;
  queryResult.value = [];

  try {
    const result = await execQuery(sqlQuery.value);
    const isSelect = sqlQuery.value.trim().toLowerCase().startsWith("select");

    console.log(result);
    consumingTime.value = result.workerRespondTime - result.workerReceivedTime

    if (isSelect) {
      queryResult.value = result?.result.resultRows || [];
    } else {
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

    <div class="mt-4 border p-4 rounded-lg">
      <h3 class="text-sm font-medium">Example Queries:</h3>
      <div class="flex gap-2 mt-2">
        <Button
          v-for="example in exampleQueries"
          :key="example.title"
          :variant="example.variant"
          @click="sqlQuery = example.query"
        >
          {{ example.title }}
        </Button>
      </div>
    </div>

    <div class="mt-6">
      <Textarea
        v-model="sqlQuery"
        rows="4"
        class="w-full px-4 py-3 rounded-lg font-mono text-sm border"
        :disabled="isLoading"
      />
      <p class="text-sm text-muted-foreground">
        Your SQL that to be executed.
      </p>

      <Button
        :disabled="isLoading"
        class="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
        @click="runQuery"
      >
        {{ isLoading ? "Running..." : "Run Query" }}
      </Button>

      <div v-if="consumingTime">Consumes time: {{ consumingTime ? `${consumingTime}ms`: null }}</div>
    </div>

    <div
      v-if="error || queryError"
      class="mt-4 p-4 rounded-lg bg-red-50 text-red-600"
    >
      {{ error?.message || queryError }}
    </div>

    <div v-if="queryResult.length" class="mt-4">
      <div class="mt-2 overflow-x-auto">
        <Table>
          <TableCaption>Results</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                v-for="column in Object.keys(queryResult[0])"
                :key="column"
                class="px-4 py-2 text-left"
              >
                {{ column }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(row, index) in queryResult" :key="index">
              <TableCell
                v-for="column in Object.keys(row)"
                :key="column"
                class="px-4 py-2"
              >
                {{ row[column] }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
