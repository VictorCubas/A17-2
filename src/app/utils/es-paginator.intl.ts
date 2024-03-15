import { MatPaginatorIntl } from '@angular/material/paginator';

const esRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) { return `0 de ${length}`; }

    length = Math.max(length, 0);

    const startIndex = page * pageSize;

    // Solucion indice inicial excede longitud de la lista
    const endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;

    return `${startIndex + 1} - ${endIndex} de ${length}`;
};

export function getEspanishPaginatorIntl() {
    const paginatorIntl = new MatPaginatorIntl();

    paginatorIntl.itemsPerPageLabel = 'Cantidad por página:';
    paginatorIntl.nextPageLabel = 'Página siguiente';
    paginatorIntl.previousPageLabel = 'Página anterior';
    paginatorIntl.getRangeLabel = esRangeLabel;
    paginatorIntl.firstPageLabel = 'Primera página';
    paginatorIntl.lastPageLabel = 'Última página';

    return paginatorIntl;
}
