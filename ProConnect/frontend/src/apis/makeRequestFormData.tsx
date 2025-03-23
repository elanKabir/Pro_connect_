import { BACKEND_API_URL } from "./config";

type RequestOptions = {
    method: string;
    headers: Record<string, string>;
    body?: FormData;
};

const makeFormDataRequest = async (
    route: string,
    method: string,
    formData: FormData,
    userToken: string | null
): Promise<any> => {
    // Setup request options
    const requestOptions: RequestOptions = {
        method: method,
        headers: {
            // Note: 'Content-Type' is not set, it will be automatically set by the browser when using FormData
            'Authorization': `Bearer ${userToken}`
        },
        body: formData
    };

    try {
        const response = await fetch(`${BACKEND_API_URL}${route}`, requestOptions);
        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server returned ${response.status}: ${errorText}`);
        }

        // Assuming the server responds with JSON content
        return await response.json();
    } catch (error) {
        console.error('Error making FormData request:', error);
        throw error; // Re-throw the error for further handling if needed
    }
};

export default makeFormDataRequest;
