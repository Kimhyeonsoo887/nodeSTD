import { Module } from "@nestjs/common";
import { HelloController }  from "./hello.controller";

@Module({ // 모듈 데코레이터
    controllers: [HelloController],
})

export class HelloModule{}
