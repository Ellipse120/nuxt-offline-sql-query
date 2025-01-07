<script setup lang="ts">
import {RadioGroup, RadioGroupItem} from "~/components/ui/radio-group";

const { isLoading, error, execQuery } = useSQLite();
const exampleTable = ref('test_table')
const sqlQuery = ref(`SELECT * FROM ${exampleTable.value}`)
const queryResult = ref<any[]>([]);
const queryError = ref<string | null>(null);
const consumingTime = ref<number | null>(null)

type exampleType = {
  title: string;
  query: string;
};

const exampleQueries = computed<exampleType[]>(() => [
  {
    title: "Select All",
    query: `SELECT * FROM ${exampleTable.value}`,
  },
  {
    title: "Insert",
    query: `INSERT INTO ${exampleTable.value} (name, created_at) VALUES ('Item ' || abs(random() % 10000), datetime('now', 'localtime'))`,
  },
  {
    title: "Update",
    query: `UPDATE ${exampleTable.value} SET name = 'Updated Item' WHERE name LIKE 'New%'`,
  },
  {
    title: "Delete",
    query: `DELETE FROM ${exampleTable.value} WHERE name = 'Item'`,
  },
]);

const tableColumns = ref<string[]>([])

watch(
  exampleTable,
  async (newVal) => {
    const t = await execQuery(`pragma table_info('${newVal}')`)
    tableColumns.value = t?.result?.resultRows?.map((row) => row?.[1] as string) || []

    sqlQuery.value = `SELECT * FROM ${newVal}`
  },
  {
    immediate: true
  }
)

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
        (await execQuery(`SELECT * FROM ${exampleTable.value}`))?.result.resultRows || [];
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

      <Label>Example Table: </Label>
      <Input v-model="exampleTable" class="mb-2" />

      <Label >Example SQL Queries:</Label>
      <div class="flex gap-2 mt-2">
        <RadioGroup v-model="sqlQuery" class="flex">
          <template v-for="example in exampleQueries" :key="example.title">
            <RadioGroupItem :id="example.title" :value="example.query" />
            <Label :for="example.title">
              {{ example.title }}
            </Label>
          </template>
        </RadioGroup>
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
        {{ isLoading ? "Running..." : "Run SQL" }}
      </Button>

      <div v-if="consumingTime">Consumes Time: {{ consumingTime ? `${(consumingTime).toFixed(2)} ms`: null }}</div>
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
                v-for="column in tableColumns"
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
