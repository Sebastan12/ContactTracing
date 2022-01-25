import { inject, injectable } from 'inversify';
import { LoggerService } from './logger.service';
import { Connection, r, RConnectionOptions, RDatum } from 'rethinkdb-ts';
import * as databaseConfiguration from '../../configuration/database-config.json';
import { Entry } from '../../models/entry.model';

@injectable()
export class DatabaseService {
  constructor(
    @inject(LoggerService.name) private loggerService: LoggerService
  ) {}

  public async initialize(): Promise<boolean> {
    const connection = await this.connect();
    r.dbList()
      .contains(databaseConfiguration.databaseName)
      .do((containsDatabase: RDatum<boolean>) => {
        return r.branch(
          containsDatabase,
          { created: 0 },
          r.dbCreate(databaseConfiguration.databaseName)
        );
      })
      .run(connection)
      .then(() => {
        this.loggerService.info('Trying to create tables');
        this.createTables(connection)
          .then(() => {
            this.loggerService.info('Tables created');
            return Promise.resolve(true);
          })
          .catch((error) => {
            this.loggerService.error(error);
            return Promise.reject(false);
          });
      });
      return Promise.resolve(true);
  }

  public getAllEntries(): Promise<Array<Entry>> {
    return new Promise((resolve, reject) => {
      this.connect().then((connection: Connection) => {
        r.db(databaseConfiguration.databaseName)
          .table('webDevEntries')
          .filter({})
          .run(connection)
          .then((response: Array<Entry>) => {
            resolve(response);
          })
          .catch((error) => {
            this.loggerService.error(error, 'Error while retrieving entries');
          });
      });
    });
  }

  private createTables(connection: Connection): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const promises = new Array<Promise<boolean>>();
      databaseConfiguration.databaseTables.forEach((table) => {
        promises.push(this.createTable(connection, table));
      });
      Promise.all(promises)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          this.loggerService.error(error);
          reject(false);
        });
    });
  }

  private createTable(
    connection: Connection,
    tableName: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      r.db(databaseConfiguration.databaseName)
        .tableList()
        .contains(tableName)
        .do((containsTable: RDatum<boolean>) => {
          return r.branch(
            containsTable,
            { create: 0 },
            r.db(databaseConfiguration.databaseName).tableCreate(tableName)
          );
        })
        .run(connection)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          this.loggerService.error(error);
          reject(false);
        });
    });
  }

  private connect(): Promise<Connection> {
    const rethinkDbOptions: RConnectionOptions = {
      host: databaseConfiguration.databaseServer,
      port: databaseConfiguration.databasePort,
    };
    return new Promise((resolve, reject) => {
      r.connect(rethinkDbOptions)
        .then((connection: Connection) => {
          resolve(connection);
        })
        .catch(reject);
    });
  }
}
