import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminsService {
    async getForms(){
        return "This is the list of forms";
    }
}
