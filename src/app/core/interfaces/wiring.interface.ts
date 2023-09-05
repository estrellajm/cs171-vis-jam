/**
    ***************
    *** ACRONYM ***
    ***************
    Coax - Coaxial Cable (Copper)
    Twinax - Twinaxial Cable (Copper)
    SMF	- Single-Mode Optical Fiber
    MMF -	Multi-Mode Optical Fiber

    CTEC - Charter Technology and Engineering Center
    EC - Edge Connects

    CKID - Circuit ID
 */

export type WireType = 'coax' | 'twinax' | 'smf' | 'mmf' | 'copper';
export type LabTeam = 'ctec' | 'ec';
export type StatusType = 'queued' | 'in progress' | 'completed' | 'cancelled';

export interface WiringPoint {
  id: string;
  pod: string;
  row: number;
  rack: number;
  unit: string;
  name: string;
  notes: string;
  slot: string;
  port: string | number;
  portType: WireType;
}

export interface Wiring {
  id: string;
  notes: string;
  circuitId: string;
  from: WiringPoint;
  to: WiringPoint;
}

export interface WiringRequest {
  id: string;
  labTeam: LabTeam;
  requestingTeam: string;
  jira: string;
  date: Date;
  status: StatusType;
  wiring: Wiring[];
}
