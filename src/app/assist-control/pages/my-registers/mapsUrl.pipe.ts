import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appMapsUrl',
  standalone: true,
})
export class MapsUrlPipe implements PipeTransform {
  transform(geo: { coords: { latitude: string; longitude: string } }): unknown {
    return `https://www.google.com/maps?q=${geo.coords.latitude},${geo.coords.longitude}&hl=es-PY&gl=py&shorturl=1`;
  }
}
