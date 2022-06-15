const Machinery = require('../models/machineryModel');
const Construction = require('../models/constructionModel');
const Article = require('../models/articleModel');
const ApiError = require('../error/index');

class dataController {
  async getMachinery(req, res, next) {
    try {
      const machinery  = await Machinery.find({});
      res.send([...machinery]);
    } catch (err) {
      next(ApiError.internal(err));
    }
  }
  async getSingleMachinery(req, res) {
    try {
      const machinery  = await Machinery.findOne({ id: req.body.id });

      const similarOnes = [];
      const getSimilarOnes = async () => {
        for(const id of machinery.similarOnes) {
          const item = await Machinery.findOne({ id })
          similarOnes.push(item);
        }
        res.send({machinery, similarOnes});
      };

      getSimilarOnes();
    } catch (err) {
      next(ApiError.internal(err));
    }
  }

  async getSingleConstruction(req, res) {
    try {
      const construction  = await Construction.findOne({ id: req.body.id });

      const similarOnes = [];
      const getSimilarOnes = async () => {
        for(const id of construction.anotherConstructions) {
          const item = await Construction.findOne({ id })
          similarOnes.push(item);
        }
        res.send({construction, similarOnes});
      };

      getSimilarOnes();
    } catch (err) {
      next(ApiError.internal(err));
    }
  }

  async getConstructions(req, res) {
    try {
      const constructions  = await Construction.find({});
      res.send({ constructions, hasMore: constructions > 9 });
    } catch (err) {
      next(ApiError.internal(err));
    }
  }

  async getConstructionsIds(req, res) {
    try {
      const constracts  = await Construction.find();
      if (!constracts) {
        return res.status(200).json({ message: "No constracts found" })
      }

      const IDS = constracts.reduce((accum, next) => [...accum, next.id], [])
      res.send({ items: IDS })
    } catch (error) {
      next(ApiError.internal(err));
    }
  }

  async getArticlesIds(req, res) {
    try {
      const articles  = await Article.find();
      if (!articles) {
        return res.status(200).json({ message: "No articles found" })
      }

      const IDS = articles.reduce((accum, next) => [...accum, next.id], [])
      res.send({ items: IDS })
    } catch (error) {
      next(ApiError.internal(err));
    }
  }

  async getArticles(req, res) {
    try {
      const itemsInChunk = 6

      const articles  = await Article.find();
      if (!req.query.chunk) {
        return res.send({ items: articles });
      }
      const currPortion = articles.filter(a => a.id <= Number(req.query.chunk) * itemsInChunk )
      const hasMore = articles.length > itemsInChunk * Number(req.query.chunk)

      res.send({ items: currPortion, hasMore });
    } catch (err) {
      next(ApiError.internal(err));
    }
  }

  async getSingleArticle(req, res) {
    try {
      const article  = await Article.findOne({ id: req.body.id });
      res.send(article);
    } catch (err) {
      next(ApiError.internal(err));
    }
  }
}

module.exports = new dataController();
