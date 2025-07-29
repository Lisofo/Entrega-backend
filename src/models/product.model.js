import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    index: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  stock: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  category: { 
    type: String, 
    required: true,
    index: true 
  },
  status: { 
    type: Boolean, 
    default: true 
  },
  thumbnails: { 
    type: [String], 
    default: [] 
  }
}, { 
  timestamps: true 
});

productSchema.plugin(mongoosePaginate);

export const Product = mongoose.model('Product', productSchema);