import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Play } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Mock content for demonstration
// Mock content for demonstration
const MODULE_CONTENT: Record<string, any> = {
  'intro-ml': {
    title: 'Introduction to Machine Learning',
    sections: [
      {
        title: 'Core Concepts',
        content: (
          <div className="space-y-4">
            <p>This module establishes the foundation of AI by explaining how machines learn from data rather than explicit instructions.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>What is ML?</strong>: A branch of AI focused on building statistical algorithms that learn from experience (data) to make predictions or decisions on unseen information.</li>
              <li><strong>The Role of Data</strong>: Data is the foundation. <strong>Preprocessing</strong> (cleaning and normalizing) ensures reliability, while <strong>Feature Extraction</strong> identifies the specific attributes that contribute to accurate predictions.</li>
            </ul>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-500 italic mt-6 text-center">
              Workflow: Data Collection → Preprocessing → Model Training → Evaluation
            </div>
          </div>
        )
      },
      {
        title: 'Learning Paradigms',
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supervised Learning</strong>: The model learns from "labeled" data (inputs paired with correct outcomes) to predict targets for new inputs.</li>
              <li><strong>Unsupervised Learning</strong>: The model analyzes unlabeled data to find hidden patterns or groupings, such as customer segmentation.</li>
              <li><strong>Reinforcement Learning</strong>: An agent learns through trial and error, receiving <strong>Rewards</strong> for good actions and <strong>Punishments</strong> for bad ones.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  'decision-trees': {
    title: 'Decision Trees & Random Forests',
    sections: [
      {
        title: 'Decision Tree Structure',
        content: (
          <div className="space-y-4">
            <p>These models are intuitive because they mimic human decision-making using a flowchart-like structure.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Root Node</strong>: The top-most node where the first split occurs based on the most important feature.</li>
              <li><strong>Internal/Decision Nodes</strong>: Intermediate tests on specific attributes (e.g., "Is Petal Width &lt; 0.8?").</li>
              <li><strong>Leaf Nodes</strong>: The final outcomes or class labels where no further splitting occurs.</li>
            </ul>
          </div>
        )
      },
      {
        title: 'Key Principles',
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Splitting Criteria</strong>: Trees use <strong>Gini Impurity</strong> (measuring disorder) or <strong>Information Gain</strong> (reduction in entropy) to decide which feature splits the data into the "purest" possible groups.</li>
              <li><strong>Overfitting</strong>: A deep tree may memorize noise in the training data, failing on new data. This is often mitigated by <strong>Pruning</strong> or setting a <strong>Max Depth</strong>.</li>
              <li><strong>Random Forest</strong>: An <strong>Ensemble</strong> method that trains many trees on random subsets of data and features. The final prediction is a "majority vote" of all individual trees, which significantly reduces overfitting.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  'neural-networks': {
    title: 'Neural Networks Basics',
    sections: [
      {
        title: 'Architecture',
        content: (
          <div className="space-y-4">
            <p>Neural networks are inspired by the human brain and are designed to recognize complex, non-linear relationships in high-dimensional data.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Input Layer</strong>: Receives the raw data (e.g., pixels from an image).</li>
              <li><strong>Hidden Layers</strong>: Intermediate layers that perform computations to extract increasingly abstract features.</li>
              <li><strong>Neurons (Perceptrons)</strong>: The basic processing units. Each neuron calculates a <strong>weighted sum</strong> of its inputs, adds a <strong>bias</strong>, and passes the result through an <strong>activation function</strong>.</li>
            </ul>
          </div>
        )
      },
      {
        title: 'Activation Functions',
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Why they matter</strong>: Without them, a network can only learn linear patterns. They introduce "non-linearity," allowing the network to solve complex problems.</li>
              <li><strong>Sigmoid</strong>: Squashes values between 0 and 1, ideal for predicting probabilities.</li>
              <li><strong>ReLU (Rectified Linear Unit)</strong>: Maps negative values to zero, ensuring only "activated" features contribute to the next layer.</li>
            </ul>
          </div>
        )
      }
    ]
  },
  'cnn': {
    title: 'Convolutional Neural Networks (CNN)',
    sections: [
      {
        title: 'The CNN Pipeline',
        content: (
          <div className="space-y-4">
            <p>CNNs are the gold standard for image recognition because they preserve the spatial relationships between pixels.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Convolutional Layer</strong>: The "eye" of the network. It slides small grids called <strong>Filters (Kernels)</strong> over the image to detect patterns like edges, curves, or textures.</li>
              <li><strong>Pooling Layer</strong>: Reduces the spatial dimensions (width/height) of the data, which lowers the number of parameters and computation while retaining the most significant features.</li>
              <li><strong>Fully Connected Layer</strong>: The final classification stage where the abstracted features are mapped to a specific output label.</li>
            </ul>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm text-slate-500 italic mt-6 text-center">
              Architecture: Convolutional Layer → Pooling Layer → Fully Connected Layer
            </div>
          </div>
        )
      },
      {
        title: 'Key Vocabulary',
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Stride</strong>: The distance (number of pixels) the filter moves over the input matrix.</li>
              <li><strong>Padding</strong>: Adding zeros around the edge of an image to ensure filters can process pixels at the very border.</li>
              <li><strong>Translation Invariance</strong>: The ability of the network to recognize an object regardless of where it appears in the frame, largely enabled by pooling layers.</li>
            </ul>
          </div>
        )
      }
    ]
  }
};

export default function ModuleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { completeModule } = useAuthStore();
  const [currentSection, setCurrentSection] = useState(0);
  
  const moduleData = MODULE_CONTENT[id || 'intro-ml'] || MODULE_CONTENT['intro-ml'];

  const handleComplete = async () => {
    if (id) {
      await completeModule(id);
      navigate('/modules');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <button 
        onClick={() => navigate('/modules')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Modules
      </button>

      <header>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{moduleData.title}</h1>
        <div className="flex gap-2">
          {moduleData.sections.map((_: any, idx: number) => (
            <div 
              key={idx} 
              className={`h-2 flex-1 rounded-full ${idx <= currentSection ? 'bg-maroon-600' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      </header>

      <motion.div
        key={currentSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
      >
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {moduleData.sections[currentSection].title}
        </h2>
        <p className="text-lg text-slate-700 leading-relaxed mb-8">
          {moduleData.sections[currentSection].content}
        </p>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          {currentSection < moduleData.sections.length - 1 ? (
            <button
              onClick={() => setCurrentSection(s => s + 1)}
              className="flex items-center gap-2 px-6 py-3 bg-maroon-600 text-white rounded-xl font-medium hover:bg-maroon-700 transition-colors"
            >
              Next Section <Play size={18} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Complete Module <CheckCircle2 size={18} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
