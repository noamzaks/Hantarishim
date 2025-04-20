import {
  ActionIcon,
  Button,
  Checkbox,
  Table,
  TableData,
  TextInput,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core"
import React, { useState } from "react"
import "./DataTable.css"
import FontAwesome from "./FontAwesome"
import { downloadFile } from "../lib/utilities"
import { useColorScheme } from "@mantine/hooks"

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
  hideIfEmpty,
  selectable,
  selectedRows,
  setSelectedRows,
  defaultSort,
  defaultReversed,
}: {
  tableName: string
  data: DataTableData
  renderValue?: (
    rowIndex: number,
    columnName: string,
    value: string,
  ) => React.ReactNode
  renderHead?: (columnName: string, columnIndex: number) => React.ReactNode
  disableSort?: boolean
  hideDownload?: boolean
  hideIfEmpty?: boolean
  selectable?: boolean
  selectedRows?: number[]
  setSelectedRows?: React.Dispatch<React.SetStateAction<number[]>>
  defaultSort?: number
  defaultReversed?: boolean
}) => {
  const [sortByColumn, setSortByColumn] = useState(defaultSort ?? 0)
  const [reversed, setReversed] = useState(defaultReversed ?? false)
  const [search, setSearch] = useState("")
  const theme = useMantineTheme()
  const colorScheme = useColorScheme()

  if (hideIfEmpty && data.body.length === 0) {
    return <></>
  }

  const reverseValue = reversed ? -1 : 1

  const id = (_: number, __: string, value: string) => value
  renderValue = renderValue ?? id
  const headId = (value: string) => value
  renderHead = renderHead ?? headId

  const bodyIndices = []
  for (let i = 0; i < data.body.length; i++) {
    bodyIndices.push(i)
  }

  const sortedIndices = bodyIndices
    .filter((i) =>
      data.body[i].some(
        (x, j) =>
          x?.includes(search) ||
          renderValue(i, data.head[j], x)?.toString().includes(search),
      ),
    )
    .sort((a, b) => {
      if (disableSort) {
        return 1
      }

      return (
        reverseValue *
        (data.body[a][sortByColumn] ?? "").localeCompare(
          data.body[b][sortByColumn] ?? "",
        )
      )
    })

  const displayData: TableData = {
    head: data.head.map(renderHead),
    body: sortedIndices.map((rowIndex) =>
      data.body[rowIndex].map((value, columnIndex) =>
        renderValue(rowIndex, data.head[columnIndex], value),
      ),
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
        rightSection={
          search !== "" ? (
            <ActionIcon
              onClick={() => setSearch("")}
              variant="transparent"
              color="default"
              size={15}
            >
              <FontAwesome icon="xmark" />
            </ActionIcon>
          ) : undefined
        }
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      <div style={{ maxWidth: "100%", overflow: "auto", maxHeight: 500 }}>
        <Table horizontalSpacing={7.5} verticalSpacing={7.5}>
          <Table.Thead
            style={{
              position: "sticky",
              top: 0,
              backgroundColor:
                colorScheme === "dark" ? theme.colors.dark[7] : "white",
            }}
          >
            <Table.Tr>
              {selectable && <Table.Th />}
              {displayData.head?.map((element, columnIndex) => (
                <Table.Th key={columnIndex} style={{ padding: 0 }}>
                  {element !== "" && (
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
                  )}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {displayData.body?.map((row, rowIndex) => {
              const realIndex = sortedIndices[rowIndex]

              return (
                <Table.Tr key={rowIndex}>
                  {selectable && (
                    <Table.Td>
                      <Checkbox
                        checked={selectedRows?.includes(realIndex)}
                        onChange={(e) => {
                          if (setSelectedRows) {
                            if (e.currentTarget.checked) {
                              setSelectedRows((s) => [...s, realIndex])
                            } else {
                              setSelectedRows((s) =>
                                s.filter((x) => x !== realIndex),
                              )
                            }
                          }
                        }}
                      />
                    </Table.Td>
                  )}
                  {row.map((value, valueIndex) => (
                    <Table.Td key={valueIndex} style={{ whiteSpace: "nowrap" }}>
                      {value}
                    </Table.Td>
                  ))}
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
        {!hideDownload && (
          <Button
            w="100%"
            mt="xs"
            leftSection={<FontAwesome icon="download" />}
            onClick={() => downloadTableData(tableName, data)}
          >
            הורדה כ-CSV
          </Button>
        )}
      </div>
    </>
  )
}

export default DataTable
