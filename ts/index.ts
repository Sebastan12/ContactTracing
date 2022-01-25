import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import { IoContainer } from './core/ioc/ioc.container';
import { LoggerService } from './core/services/logger.service';
import { DatabaseService } from './core/services/database.service';

const container = new IoContainer();
container.init();

const logger = container.getContainer().resolve(LoggerService);
const databseService = container.getContainer().resolve(DatabaseService);

const server = new InversifyExpressServer(container.getContainer());


databseService.initialize().then(()=>{
    const app = server.build();
    app.listen(9999);
    logger.info('Server listening on port 9999')
}).catch((error)=>{
    logger.error(error, 'Error while starting express server');
    process.exit(-1);
});

