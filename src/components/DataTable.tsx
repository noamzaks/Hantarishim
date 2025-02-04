import {
  Button,
  Table,
  TableData,
  TextInput,
  UnstyledButton,
} from "@mantine/core"
import React, { useState } from "react"
import "./DataTable.css"
import FontAwesome from "./FontAwesome"
import { downloadFile } from "../lib/utilities"

export const downloadTableData = (tableName: string, tableData: TableData) => {
  const csv =
    tableData.head!.join(",") +
    "\n" +
    tableData.body!.map((row) => row.join(",")).join("\n")
  downloadFile(tableName + ".csv", "text/csv", csv)
}

export interface DataTableData {
  head: string[]
  body: string[][]
}

const DataTable = ({
  tableName,
  data,
  renderValue,
  renderHead,
  disableSort,
  hideDownload,
}: {
  tableName: string
  data: DataTableData
  renderValue?: (
    rowIndex: number,
    columnName: string,
    value: string
  ) => React.ReactNode
  renderHead?: (columnName: string, columnIndex: number) => React.ReactNode
  disableSort?: boolean
  hideDownload?: boolean
}) => {
  const [sortByColumn, setSortByColumn] = useState(0)
  const [reversed, setReversed] = useState(false)
  const [search, setSearch] = useState("")

  const reverseValue = reversed ? -1 : 1

  const id = (_: number, __: string, value: string) => value
  renderValue = renderValue ?? id
  const headId = (value: string) => value
  renderHead = renderHead ?? headId

  const bodyIndices = []
  for (let i = 0; i < data.body.length; i++) {
    bodyIndices.push(i)
  }

  const displayData: TableData = {
    head: data.head.map(renderHead),
    body: bodyIndices
      .filter((i) =>
        data.body[i].some(
          (x, j) =>
            x?.includes(search) ||
            renderValue(i, data.head[j], x)?.toString().includes(search)
        )
      )
      .sort((a, b) => {
        if (disableSort) {
          return 1
        }

        return (
          reverseValue *
          (data.body[a][sortByColumn] ?? "").localeCompare(
            data.body[b][sortByColumn] ?? ""
          )
        )
      })
      .map((rowIndex) =>
        data.body[rowIndex].map((value, columnIndex) =>
          renderValue(rowIndex, data.head[columnIndex], value)
        )
      ),
  }

  return (
    <>
      <TextInput
        mb="xs"
        w={400}
        maw="100%"
        placeholder="חיפוש"
        leftSection={<FontAwesome icon="magnifying-glass" />}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <div style={{ maxWidth: "100%", overflow: "auto" }}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              {displayData.head?.map((element, columnIndex) => (
                <Table.Th key={columnIndex} style={{ padding: 0 }}>
                  <UnstyledButton
                    className="control"
                    onClick={
                      disableSort
                        ? undefined
                        : () => {
                            if (sortByColumn === columnIndex) {
                              setReversed((r) => !r)
                            } else {
                              setSortByColumn(columnIndex)
                            }
                          }
                    }
                  >
                    {disableSort || (
                      <FontAwesome
                        props={{ style: { fontSize: 14, marginInline: 5 } }}
                        icon={
                          sortByColumn === columnIndex
                            ? reversed
                              ? "sort-up"
                              : "sort-down"
                            : "sort"
                        }
                      />
                    )}
                    {element}
                  </UnstyledButton>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {displayData.body?.map((row, rowIndex) => (
              <Table.Tr key={rowIndex}>
                {row.map((value, valueIndex) => (
                  <Table.Td key={valueIndex}>{value}</Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </div>
      {!hideDownload && (
        <Button
          w={400}
          maw="100%"
          mt="xs"
          leftSection={<FontAwesome icon="download" />}
          onClick={() => downloadTableData(tableName, data)}
        >
          הורדה כ-CSV
        </Button>
      )}
    </>
  )
}

export default DataTable
