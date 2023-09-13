import {
  Web5,
  type RecordsWriteRequest,
  type RecordsWriteResponse,
  type RecordsQueryRequest,
  type RecordsQueryResponse,
  type RecordsReadResponse,
  type RecordsReadRequest,
  type RecordsDeleteRequest,
  type RecordsDeleteResponse,
  type ProtocolsQueryRequest,
  type ProtocolsQueryResponse,
  type ProtocolsConfigureResponse,
  type ProtocolsConfigureRequest,
} from '@web5/api';

export const { web5, did } = await Web5.connect();

export async function writeRecord(
  writeRequest: RecordsWriteRequest,
): Promise<RecordsWriteResponse & { data: unknown }> {
  const { status, record } = await web5.dwn.records.write(writeRequest);
  const data = await record?.data.json();
  return {
    status,
    record,
    data,
  };
}

export async function queryRecords(
  queryRequest: RecordsQueryRequest,
): Promise<RecordsQueryResponse & { data: unknown }> {
  const { status, records } = await web5.dwn.records.query(queryRequest);
  const data = records?.map(async record => await record.data.json());
  return {
    status,
    records,
    data,
  };
}

export async function readRecord(
  readRequest: RecordsReadRequest,
): Promise<RecordsReadResponse & { data: unknown }> {
  const { status, record } = await web5.dwn.records.read(readRequest);
  const data = record?.data.json();
  return {
    status,
    record,
    data,
  };
}

export async function deleteRecord(
  deleteRequest: RecordsDeleteRequest,
): Promise<RecordsDeleteResponse> {
  const { status } = await web5.dwn.records.delete(deleteRequest);
  return {
    status,
  };
}

export async function configureProtoco(
  configureRequest: ProtocolsConfigureRequest,
): Promise<ProtocolsConfigureResponse> {
  const { status, protocol } =
    await web5.dwn.protocols.configure(configureRequest);
  return {
    status,
    protocol,
  };
}

export async function queryProtocols(
  queryRequest: ProtocolsQueryRequest,
): Promise<ProtocolsQueryResponse> {
  const { status, protocols } = await web5.dwn.protocols.query(queryRequest);
  return {
    status,
    protocols,
  };
}
