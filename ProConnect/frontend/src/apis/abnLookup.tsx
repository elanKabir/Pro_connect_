function fetchWithJsonp(abn: string, guid: string) {
    const url = `https://abr.business.gov.au/json/AbnDetails.aspx?abn=${abn}&callback=callbackFunction&guid=${guid}`;
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
    script.onload = () => {
        document.body.removeChild(script);
    };
}
export { fetchWithJsonp };