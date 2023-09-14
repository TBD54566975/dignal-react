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
import { ChatProtocol } from './protocols/chat.protocol';
import { RoutePaths } from '../routes';

let web5: Web5;
let did: string;

export async function connectWeb5() {
  const { web5: connectedWeb5, did: connectedDid } = await Web5.connect();
  [web5, did] = [connectedWeb5, connectedDid];
  return { web5, did };
}

export async function getWeb5Route() {
  const { protocols } = await web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: ChatProtocol.protocol,
      },
    },
  });
  let route;
  if (protocols?.length) {
    if (!location.pathname.includes(RoutePaths.CHAT)) {
      route = RoutePaths.CHAT;
    }
  } else {
    if (!location.pathname.includes(RoutePaths.ONBOARDING)) {
      route = RoutePaths.ONBOARDING;
    }
  }
  return route;
}

export async function writeRecord(
  writeRequest: RecordsWriteRequest,
): Promise<RecordsWriteResponse> {
  const { status, record } = await web5.dwn.records.write(writeRequest);
  return {
    status,
    record,
  };
}

export async function queryRecords(
  queryRequest: RecordsQueryRequest,
): Promise<RecordsQueryResponse> {
  const { status, records } = await web5.dwn.records.query(queryRequest);
  return {
    status,
    records,
  };
}

export async function readRecord(
  readRequest: RecordsReadRequest,
): Promise<RecordsReadResponse> {
  const { status, record } = await web5.dwn.records.read(readRequest);
  return {
    status,
    record,
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

export async function configureProtocol(
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
