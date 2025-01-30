import { AppService } from './app.service';
export declare class AppController {
    private readonly myService;
    constructor(myService: AppService);
    getData(): String[];
    addData(): void;
}
