import { NestFactory } from "@nestjs/core";
import { HelloModule } from "./hello.module";

// NextJS를 시작하는 함수
async function bootstrap(){
    //NextFactory를 사용해서 nestApplication 객체 생성
    const app = await NestFactory.create(HelloModule);

    //3000번 포트로 서버 가동
    await app.listen(3000, () => { 
        console.log("서버 시작!"); 
    });
}

bootstrap();