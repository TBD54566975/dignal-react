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

export let web5: Web5;
export let userDid: string;

export async function connectWeb5() {
  const web5Connect = await Web5.connect();
  [web5, userDid] = [web5Connect.web5, web5Connect.did];
  return web5Connect;
}

export async function getWeb5Route() {
  const { protocols } = await queryProtocols({
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
  return web5.dwn.records.write(writeRequest);
}

export async function queryRecords(
  queryRequest: RecordsQueryRequest,
): Promise<RecordsQueryResponse> {
  return web5.dwn.records.query(queryRequest);
}

export async function readRecord(
  readRequest: RecordsReadRequest,
): Promise<RecordsReadResponse> {
  return web5.dwn.records.read(readRequest);
}

export async function deleteRecord(
  deleteRequest: RecordsDeleteRequest,
): Promise<RecordsDeleteResponse> {
  return web5.dwn.records.delete(deleteRequest);
}

export async function configureProtocol(
  configureRequest: ProtocolsConfigureRequest,
): Promise<ProtocolsConfigureResponse> {
  return web5.dwn.protocols.configure(configureRequest);
}

export async function queryProtocols(
  queryRequest: ProtocolsQueryRequest,
): Promise<ProtocolsQueryResponse> {
  return web5.dwn.protocols.query(queryRequest);
}
