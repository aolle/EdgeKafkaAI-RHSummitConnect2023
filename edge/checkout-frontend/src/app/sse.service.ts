import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SseService {

    connectToSseEndpoint(endpointUrl: string): EventSource {
        return new EventSource(endpointUrl);
    }

}
