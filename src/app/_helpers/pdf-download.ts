export function downloadPdf(base64String, fileName) {
    const source = `data:application/pdf;base64,${base64String}`;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}.pdf`
    link.click();
}

export function openOnWindowPdf(base64String) {
    let pdfWindow = window.open("");
    pdfWindow.document.write(
        "<iframe width='100%' height='100%' src='" +
        encodeURI(base64String) + "'></iframe>"
    );
}