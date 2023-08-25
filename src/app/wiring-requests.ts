type WiringType = 'coax' | 'twinax' | 'smf' | 'mmf'
type LabTeam = 'ctec' | 'ec'
type StatusType = 'queued' | 'in progress' | 'completed' | 'cancelled'

export interface iWiringRequest {
    id: string;
    type: WiringType;
    labTeam: LabTeam;
    requestingTeam: string;
    mmyy: string;
    number: number;
    jira: string;
    status: StatusType
}

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