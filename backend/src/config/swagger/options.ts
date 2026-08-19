import { DocumentBuilder } from '@nestjs/swagger';

export const documentBuilderOptions = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('EduDesk API')
  .setDescription('REST API for the EduDesk teacher administrative platform')
  .setVersion('1.0.0')
  .build();
