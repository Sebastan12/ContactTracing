import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpGet, interfaces } from 'inversify-express-utils';
import { DatabaseService } from '../../core/services/database.service';
import { Entry } from '../../models/entry.model';

@controller('/entries')
@injectable()
export class EntriesController implements interfaces.Controller {
  constructor(
    @inject(DatabaseService.name) private databaseService: DatabaseService
  ) {}

  @httpGet('/')
  public getEntries(request: Request, response: Response): void {
    this.databaseService.getAllEntries().then((result: Array<Entry>) => {
      response.json(result);
    });
  }
}
