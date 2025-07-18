import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';
import { StreamingServers, SubOrSub } from '@consumet/extensions/dist/models';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
    const animeowl = new ANIME.AnimeOwl()
    let baseUrl = 'https://animeowl.me';

    fastify.get('/', (_, rp) => {
        rp.status(200).send({
            intro: `Welcome to the animeowl provider: check out the provider's website @ ${baseUrl}`,
            routes: [
                '/:query',
                '/servers/:episodeId',
                '/watch/:episodeId?dub=(true/false)&server=(server)'
            ],
        });
    });

    fastify.get('/:query', async (request: FastifyRequest, reply: FastifyReply) => {
        const query = (request.params as { query: string }).query;

        const page = (request.query as { page: number }).page;

        const res = await animeowl.search(query, page);

        reply.status(200).send(res);
    });

    fastify.get('/info/:id', async (request: FastifyRequest, reply: FastifyReply) => {
        const id = (request.params as { id: string }).id;

        const res = await animeowl.fetchAnimeInfo(id);

        reply.status(200).send(res);
    })

    fastify.get('/watch/:episodeId', async (request: FastifyRequest, reply: FastifyReply) => {
        const episodeId = (request.params as { episodeId: string }).episodeId;

        const server = (request.query as { server: string }).server as StreamingServers;
        let dub = (request.query as { dub?: string | boolean }).dub;

        const res = await animeowl.fetchEpisodeSources(episodeId, server, dub == true ? SubOrSub.DUB : SubOrSub.SUB);

        reply.status(200).send(res);
    })

     fastify.get('/servers/:episodeId', async (request: FastifyRequest, reply: FastifyReply) => {
        const episodeId = (request.params as { episodeId: string }).episodeId;

        let dub = (request.query as { dub?: string | boolean }).dub;

        const res = await animeowl.fetchEpisodeServers(episodeId, dub == true ? SubOrSub.DUB : SubOrSub.SUB);

        reply.status(200).send(res);
    })
};

export default routes;
