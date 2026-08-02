// A curated corpus of concepts spanning ML, systems, science, and culture.
// The galaxy's structure is NOT hand-authored — clusters emerge purely from
// the transformer embeddings + k-means. `domain` is kept only for the legend
// tooltip, never fed to the layout, so the demo proves the model "understands".

export const CORPUS = [
  // --- Machine Learning foundations ---
  { t: "Gradient descent optimizes model weights by following the negative gradient of the loss.", d: "ML" },
  { t: "Overfitting happens when a model memorizes training noise instead of the signal.", d: "ML" },
  { t: "Regularization like L2 weight decay penalizes complexity to improve generalization.", d: "ML" },
  { t: "The bias-variance tradeoff balances underfitting against overfitting.", d: "ML" },
  { t: "Cross-validation estimates out-of-sample error by rotating held-out folds.", d: "ML" },
  { t: "Random forests average many decorrelated decision trees to reduce variance.", d: "ML" },
  { t: "Gradient boosting fits each new tree to the residual errors of the ensemble.", d: "ML" },
  { t: "Support vector machines find the maximum-margin separating hyperplane.", d: "ML" },
  { t: "Principal component analysis projects data onto directions of maximal variance.", d: "ML" },
  { t: "K-means clusters points by iteratively assigning them to the nearest centroid.", d: "ML" },
  { t: "The confusion matrix summarizes true and false positives and negatives.", d: "ML" },
  { t: "Feature scaling and normalization keep gradient updates well-conditioned.", d: "ML" },
  { t: "Hyperparameter search tunes learning rate, depth, and regularization strength.", d: "ML" },
  { t: "Logistic regression models the log-odds of a binary outcome linearly.", d: "ML" },
  { t: "The ROC curve traces the tradeoff between sensitivity and specificity.", d: "ML" },

  // --- Deep learning ---
  { t: "Backpropagation computes gradients through the chain rule across network layers.", d: "Deep Learning" },
  { t: "Convolutional neural networks share weights to detect translation-invariant features.", d: "Deep Learning" },
  { t: "Dropout randomly deactivates neurons during training to prevent co-adaptation.", d: "Deep Learning" },
  { t: "Batch normalization stabilizes training by normalizing layer activations.", d: "Deep Learning" },
  { t: "Residual connections let gradients flow through very deep networks.", d: "Deep Learning" },
  { t: "The ReLU activation introduces nonlinearity while avoiding vanishing gradients.", d: "Deep Learning" },
  { t: "Adam combines momentum and adaptive learning rates for fast convergence.", d: "Deep Learning" },
  { t: "Transfer learning fine-tunes a pretrained network on a small target dataset.", d: "Deep Learning" },
  { t: "Autoencoders learn compressed latent codes by reconstructing their input.", d: "Deep Learning" },
  { t: "Generative adversarial networks pit a generator against a discriminator.", d: "Deep Learning" },
  { t: "Diffusion models generate images by iteratively denoising random noise.", d: "Deep Learning" },
  { t: "Recurrent networks carry hidden state across sequential time steps.", d: "Deep Learning" },

  // --- NLP & LLMs ---
  { t: "The transformer replaces recurrence with self-attention over the whole sequence.", d: "NLP" },
  { t: "Self-attention lets each token weigh the relevance of every other token.", d: "NLP" },
  { t: "Word embeddings map tokens to dense vectors where meaning is geometry.", d: "NLP" },
  { t: "Positional encodings inject word order into the attention mechanism.", d: "NLP" },
  { t: "Large language models are pretrained to predict the next token at scale.", d: "NLP" },
  { t: "Tokenization splits text into subword units the model can process.", d: "NLP" },
  { t: "Retrieval-augmented generation grounds answers in fetched documents.", d: "NLP" },
  { t: "Named entity recognition tags people, places, and organizations in text.", d: "NLP" },
  { t: "Sentiment analysis classifies the emotional polarity of a passage.", d: "NLP" },
  { t: "Beam search explores multiple high-probability decoding paths at once.", d: "NLP" },
  { t: "Cosine similarity measures the angle between two embedding vectors.", d: "NLP" },

  // --- Computer vision ---
  { t: "Object detection localizes and labels multiple items within an image.", d: "Vision" },
  { t: "Semantic segmentation assigns a class label to every pixel.", d: "Vision" },
  { t: "Optical flow estimates pixel motion between consecutive video frames.", d: "Vision" },
  { t: "Facial landmark detection locates key points like eyes and nose.", d: "Vision" },
  { t: "Image classification predicts a single category for a whole picture.", d: "Vision" },
  { t: "Pose estimation reconstructs the skeleton of a human body from pixels.", d: "Vision" },
  { t: "Vision transformers split an image into patches treated as tokens.", d: "Vision" },
  { t: "Edge detection highlights sharp intensity changes with gradient filters.", d: "Vision" },

  // --- Systems & distributed computing ---
  { t: "MapReduce parallelizes computation over massive datasets across a cluster.", d: "Systems" },
  { t: "Consistent hashing distributes keys evenly as nodes join or leave.", d: "Systems" },
  { t: "The CAP theorem trades consistency against availability under partitions.", d: "Systems" },
  { t: "Load balancers spread incoming requests across many backend servers.", d: "Systems" },
  { t: "Caching stores hot results close to the user to cut latency.", d: "Systems" },
  { t: "Message queues decouple producers from consumers for resilient pipelines.", d: "Systems" },
  { t: "Sharding partitions a database horizontally to scale write throughput.", d: "Systems" },
  { t: "Raft keeps a replicated log consistent by electing a single leader.", d: "Systems" },
  { t: "Containers package an application with its dependencies for portability.", d: "Systems" },
  { t: "A rate limiter caps how many requests a client may send per second.", d: "Systems" },

  // --- Databases ---
  { t: "B-tree indexes let databases find rows without scanning every page.", d: "Databases" },
  { t: "ACID transactions guarantee atomicity, consistency, isolation, durability.", d: "Databases" },
  { t: "Query planners choose the cheapest way to execute a SQL statement.", d: "Databases" },
  { t: "Vector databases index embeddings for fast nearest-neighbor search.", d: "Databases" },
  { t: "Normalization removes redundancy by splitting data into related tables.", d: "Databases" },
  { t: "Write-ahead logging records changes before applying them for crash recovery.", d: "Databases" },

  // --- Security ---
  { t: "Public-key cryptography encrypts with one key and decrypts with another.", d: "Security" },
  { t: "Hashing turns a password into an irreversible fixed-length digest.", d: "Security" },
  { t: "SQL injection exploits unsanitized input to run malicious queries.", d: "Security" },
  { t: "Zero-trust architecture verifies every request regardless of origin.", d: "Security" },
  { t: "A digital signature proves a message came from its claimed sender.", d: "Security" },
  { t: "Rate limiting and CAPTCHAs blunt automated brute-force attacks.", d: "Security" },

  // --- Biology & chemistry ---
  { t: "DNA stores genetic instructions in sequences of four nucleotide bases.", d: "Biology" },
  { t: "Proteins fold into three-dimensional shapes that determine their function.", d: "Biology" },
  { t: "Photosynthesis converts sunlight, water, and carbon dioxide into sugar.", d: "Biology" },
  { t: "Mitochondria generate chemical energy that powers the living cell.", d: "Biology" },
  { t: "CRISPR edits genomes by cutting DNA at a programmed target site.", d: "Biology" },
  { t: "Neurons transmit signals through electrical and chemical synapses.", d: "Biology" },
  { t: "Catalysts speed chemical reactions without being consumed themselves.", d: "Chemistry" },
  { t: "The periodic table organizes elements by their atomic number.", d: "Chemistry" },

  // --- Space & physics ---
  { t: "Black holes warp spacetime so strongly that light cannot escape.", d: "Space" },
  { t: "Galaxies contain billions of stars bound together by gravity.", d: "Space" },
  { t: "The Doppler effect shifts a star's spectrum as it moves toward or away.", d: "Space" },
  { t: "Quantum entanglement links particles so measuring one affects the other.", d: "Physics" },
  { t: "General relativity describes gravity as the curvature of spacetime.", d: "Physics" },
  { t: "Nuclear fusion powers stars by merging light atomic nuclei.", d: "Physics" },
  { t: "The speed of light is the universal cosmic speed limit.", d: "Physics" },

  // --- Finance & economics ---
  { t: "Compound interest grows savings exponentially as returns earn returns.", d: "Finance" },
  { t: "Portfolio diversification lowers risk by spreading bets across assets.", d: "Finance" },
  { t: "A stock's price reflects the market's expectation of future earnings.", d: "Finance" },
  { t: "Inflation erodes the purchasing power of money over time.", d: "Finance" },
  { t: "Supply and demand set the equilibrium price in a free market.", d: "Finance" },
  { t: "Options give the right, but not the obligation, to buy or sell an asset.", d: "Finance" },

  // --- Music & art ---
  { t: "A major scale follows a fixed pattern of whole and half steps.", d: "Music" },
  { t: "Harmony stacks notes into chords that support a melody.", d: "Music" },
  { t: "Rhythm organizes sound in time through beats and accents.", d: "Music" },
  { t: "Perspective in painting creates the illusion of depth on a flat canvas.", d: "Art" },
  { t: "Complementary colors sit opposite each other on the color wheel.", d: "Art" },
  { t: "Impressionism captures fleeting light with loose, visible brushstrokes.", d: "Art" },

  // --- Food & cooking ---
  { t: "The Maillard reaction browns food and deepens its savory flavor.", d: "Food" },
  { t: "Fermentation lets microbes transform sugar into acids, gas, or alcohol.", d: "Food" },
  { t: "Emulsions blend oil and water into a smooth, stable sauce.", d: "Food" },
  { t: "Kneading develops gluten so bread dough can trap rising gas.", d: "Food" },

  // --- Sports ---
  { t: "A marathon tests endurance over roughly forty-two kilometers.", d: "Sports" },
  { t: "In chess, controlling the center gives pieces maximum mobility.", d: "Sports" },
  { t: "A tennis serve starts every point and rewards speed and placement.", d: "Sports" },
  { t: "Basketball rewards spacing that opens driving lanes to the basket.", d: "Sports" },
];

// Distinct hues per domain for the legend. Cluster colors are computed live.
export const DOMAIN_COLORS = {
  "ML": "#7cf6ff", "Deep Learning": "#5b9dff", "NLP": "#b58bff", "Vision": "#ff8bd8",
  "Systems": "#ffd166", "Databases": "#f4a15b", "Security": "#ff6b6b", "Biology": "#7bffa6",
  "Chemistry": "#4be8b0", "Space": "#c8b6ff", "Physics": "#9db4ff", "Finance": "#ffe08a",
  "Music": "#ff9ecb", "Art": "#ff7a7a", "Food": "#ffb454", "Sports": "#8affc1",
};
