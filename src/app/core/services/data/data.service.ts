import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Country } from '@interfaces/country.interface';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private http = inject(HttpClient);

  public getCsvData(): Observable<any[]> {
    const csvUrl = 'assets/data/wd_indicators.csv';
    return this.http
      .get(csvUrl, { responseType: 'text' })
      .pipe(map(this.extractData));
  }

  private extractData(csv: string): any[] {
    const lines = csv.split('\n');
    return lines.map((line) => line.split(','));
  }

  getData(path: string): Observable<Country[]> {
    return this.getCsvData().pipe(
      map((csvData) => {
        // Assuming the first row of CSV data contains headers
        const headers = csvData[0];
        const dataRows = csvData.slice(1);

        return dataRows.map((row) => {
          const item = row.reduce((obj: any, val: any, index: any) => {
            obj[headers[index]] = val;
            return obj;
          }, {} as any);

          return {
            country: item.country,
            code: item.code,
            [path]: item[path],
          } as Country;
        });
      })
    );
  }
}
