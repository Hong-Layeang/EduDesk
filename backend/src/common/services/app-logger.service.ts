import { ConsoleLogger, Injectable, OnApplicationShutdown } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppLogger extends ConsoleLogger implements OnApplicationShutdown {
  private readonly stream: fs.WriteStream;

  constructor() {
    super();
    const logDir = path.join(process.cwd(), 'logs');
    fs.mkdirSync(logDir, { recursive: true });
    this.stream = fs.createWriteStream(path.join(logDir, 'errors.log'), { flags: 'a' });
  }

  error(message: any, ...optionalParams: any[]): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    super.error(message, ...optionalParams);
    this.write('ERROR', String(message));
  }

  onApplicationShutdown(): void {
    this.stream.end();
  }

  private write(level: string, content: string): void {
    this.stream.write(`[${new Date().toISOString()}] ${level}: ${content}\n`);
  }
}
