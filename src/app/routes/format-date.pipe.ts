import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace('T', ' '); // Reemplaza 'T' con un espacio
  }
}
