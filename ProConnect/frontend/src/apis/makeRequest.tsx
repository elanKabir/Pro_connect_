
import { BACKEND_API_URL } from "./config"


type RequestOptions = {
    method: string;
    headers: {
        'Content-type': string;
        'Authorization': string;
    };
    body?: string;
};


const makeRequestFn = async (
    route: string,
    method: string,
    objectBody: object | undefined,
    userToken: string | null,
    setFn: ((arg0: any) => void) | undefined
): Promise<void> => {
    const baseOptions: RequestOptions = {
        method: method,
        headers: {
            'Content-type': 'application/JSON',
            'Authorization' : 'Bearer ' + userToken,
        }
    };
    if (objectBody !== undefined) {
        baseOptions.body = JSON.stringify(objectBody);
    }
    const response = await fetch(BACKEND_API_URL + route, baseOptions);

    const returnData = await response.json();
    if (returnData.status === 'error') {
        throw new Error(returnData.message)
    } else {
        if (setFn !== undefined) {
            setFn(returnData.data)
        } else {
            return returnData.message || 'Success';
        }
    }
}

    /*
    if (response.status !== 200) {
        alert(data.error);
        throw new Error('API call failed');
    } else {
        if (setFn !== undefined)
            setFn(data);
        else {
            alert(data.message);
        }
    }
    */


export default makeRequestFn
