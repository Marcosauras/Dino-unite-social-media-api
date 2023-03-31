const { Schema, model, Types  } = require('mongoose');

// reactions to the thoughts that are to be created
const reactionSchema = new Schema(
    {
      reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
      },
      reactionBody: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
      },
      username: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (timestamp) => formatDate(timestamp),
      },
    },
    {
      toJSON: {
        getters: true,
      },
    }
  );

//   thought schema, hold information for every post that is created
const thoughtSchema = new Schema(
    {
        thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timeStamp) => formatDate(timeStamp),
        },
        username: {
            type: String,
            required: true,
        },

        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);
// creates virtual DOM
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

function formatDate(timeStamp) {
    return new Date(timeStamp).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      });
}

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;