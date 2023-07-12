import { DBReview } from './models/db.review';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { User } from 'softwareproject-common';
import { DBLocation } from './models/db.location';


export class ReviewController {

    /**
   * returns details for a review by name of location
   */
    async lookup(request: Request, response: Response): Promise<void> {

        const name = request.params.name.toLowerCase();

        if (!name) {
            console.error('client not provide name');
            response.status(404);
            response.send();
        }
        try {
            const review = await DBReview.findAll({
                where: {
                    location_name: {
                        [Op.iLike]: name
                    }
                },

            });

            if (!review) {
                console.error('did not find review for location');

                response.status(404);
                response.send({ code: 404, message: 'Keine Attraktion mit diesem Namen' });
                return;
            }


            response.status(200);
            response.send(review);
        } catch (err) {
            response.send(err);
            console.log(err);
        }
        return;
    }

    async postReview(request: Request, response: Response): Promise<void> {
        try {
            const user: User = response.locals.user;

            if (!user || !user.id) {
                response.status(200);
                response.send({
                    code: 401,
                    message: 'Unauthorized'
                });
                return;
            }

            const id = request.params.id;

            if (!id) {
                request.logger.error('client did not provide event id');
                response.status(400);
                response.send();
                return;
            }
            
            const location = await DBLocation.findByPk(id);

            if (!location) {
                request.logger.error('location id was invalid');
                response.status(400);
                response.send();
                return;
              }
          
              console.log({
                user_id: user.id,
                location_id: location.id
              });

            const review = await DBReview.create({
                user_id: user.id,
                location_id: location.id,
                location_name: location.name,
                

            });

            response.status(200);
            response.send(review);

        } catch (err) {
            request.logger.error(err);
            response.send({ code: 500, message: err });
        }
    }
}

