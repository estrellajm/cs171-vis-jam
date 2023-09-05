import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WireType,
  Wiring,
  WiringPoint,
  WiringRequest,
} from 'src/app/core/interfaces/wiring.interface';

@Component({
  selector: 'app-wiring-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wiring-table.component.html',
  styleUrls: ['./wiring-table.component.scss'],
})
export class WiringTableComponent {
  sampleData: WiringRequest[] = [];

  constructor() {
    this.generateSampleData(1);
  }

  generateSampleData(n: number) {
    const sampleWiringRequests = [];

    // Sample data arrays
    const wireTypes: WireType[] = ['coax', 'twinax', 'smf', 'mmf'];
    const labTeams = ['ctec', 'ec'];
    const statuses = ['queued', 'in progress', 'completed', 'cancelled'];

    // Generate a random integer between min and max (inclusive)
    const getRandomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const genWiringPoints = (n: number) => {
      const wiringArr: Wiring[] = [];
      // Generating 10 sample records
      const wiringPoints = [];

      for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= 2; j++) {
          // Each WiringRequest has two WiringPoints (from and to)
          const wiringPoint: WiringPoint = {
            id: `WP${i}${j}`,
            pod: `Pod${i}`,
            row: getRandomInt(1, 10),
            rack: getRandomInt(1, 5),
            unit: `Unit${j}`,
            name: `Name${i}${j}`,
            description: `Description${i}${j}`,
            slot: `Slot${j}`,
            port: getRandomInt(1, 48),
            portType: wireTypes[getRandomInt(0, wireTypes.length - 1)],
          };
          wiringPoints.push(wiringPoint);
        }

        const wiring: Wiring = {
          id: `Wiring${i}`,
          notes: `Notes for wiring ${i}`,
          ckid: `CKID${i}`,
          from: wiringPoints[0],
          to: wiringPoints[1],
        };

        wiringArr.push(wiring);
      }

      return wiringArr;
    };
    // Generate sample data
    for (let i = 1; i <= n; i++) {
      const wiringRequest = {
        id: `WR${i}`,
        type: wireTypes[getRandomInt(0, wireTypes.length - 1)],
        labTeam: labTeams[getRandomInt(0, labTeams.length - 1)],
        requestingTeam: `Team${getRandomInt(1, 5)}`,
        jira: `JIRA${i}`,
        date: new Date(),
        status: statuses[getRandomInt(0, statuses.length - 1)],
        wiring: genWiringPoints(3),
      };

      sampleWiringRequests.push(wiringRequest);
    }

    console.log(sampleWiringRequests);

    this.sampleData = sampleWiringRequests as WiringRequest[];
  }
}
