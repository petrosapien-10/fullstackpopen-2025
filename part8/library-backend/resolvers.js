const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const resolvers = {
  Query: {
    bookCount: async () => {
      console.log("Counting books for author:", root.name);
      return await Book.countDocuments({});
    },
    authorCount: async () => {
      return await Author.countDocuments({});
    },
    // allAuthors: async () => {
    //   return Author.find({});
    // },
    allAuthors: async () => {
      console.log("Fetching authors and books together (no n+1)");
      const authors = await Author.find({});
      const books = await Book.find({});

      const bookCountMap = books.reduce((acc, book) => {
        const authorId = book.author.toString();
        acc[authorId] = (acc[authorId] || 0) + 1;
        return acc;
      }, {});

      return authors.map((author) => ({
        ...author.toObject(),
        bookCount: bookCountMap[author._id.toString()] || 0,
      }));
    },

    allBooks: async (root, args) => {
      const filter = {};
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (!author) return [];
        filter.author = author._id;
        console.log("author exists, filter = ", filter);
      }

      if (args.genre) {
        filter.genres = { $in: [args.genre] };
        console.log("genre exists, filter = ", filter);
      }

      return Book.find(filter).populate("author");
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      let author = await Author.findOne({ name: args.author });

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error,
            },
          });
        }
      }
      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres,
      });
      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error,
          },
        });
      }

      const populatedBook = await book.populate("author");
      pubsub.publish("BOOK_ADDED", { bookAdded: populatedBook });
      return populatedBook;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      const author = await Author.findOne({ name: args.name });

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      if (!author) return null;

      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Updating author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.setBornTo,
            error,
          },
        });
      }

      return author;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        await user.save();
      } catch (error) {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      }
      return user;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "test1") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },

  // Author: {
  //   bookCount: async (root) => {
  //     console.log("Counting books for:", root.name);
  //     return Book.countDocuments({ author: root._id });
  //   },
  // },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
