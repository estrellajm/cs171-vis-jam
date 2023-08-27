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
 */

type WireType = 'coax' | 'twinax' | 'smf' | 'mmf';
type LabTeam = 'ctec' | 'ec';
type StatusType = 'queued' | 'in progress' | 'completed' | 'cancelled';

interface WiringPoint {
  id: string;
  pod: string;
  row: number;
  rack: number;
  unit: string;
  name: string;
  description: string;
  slot: string;
  port: string | number;
  portType: WireType;
}

export interface Wiring {
  id: string;
  notes: string;
  ckid: string;
  from: WiringPoint;
  to: WiringPoint;
}

export interface WiringRequest {
  id: string;
  type: WireType;
  labTeam: LabTeam;
  requestingTeam: string;
  jira: string;
  date: Date;
  status: StatusType;
  wiring: Wiring[];
}
