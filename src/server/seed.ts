import { adminDb } from './firebaseAdmin';
import { Subject, Product, Coupon, FAQItem, PageContent, SiteSettings } from '../types';

export const defaultSettings: SiteSettings = {
  announcement_messages: [
    { text: '🚚 Free shipping across India on all prepaid orders', highlight: 'Free shipping' },
    { text: '📚 100% handwritten-style illustrated notes for engineering & coding', highlight: 'Handwritten-style' },
    { text: '⚡ Extra 10% instant off on all prepaid orders (Applied at checkout)', highlight: '10% off' },
    { text: '🔥 Use code PY10 for additional savings on your order', highlight: 'PY10' }
  ],
  prepaid_discount_percent: 10,
  stack_prepaid_with_coupon: true,
  cod_enabled: true,
  cod_fee_paise: 4900,
  cod_max_total_paise: 500000,
  free_shipping_threshold_paise: 0,
  flat_shipping_paise: 6900,
  hold_minutes: 30,
  shiprocket_pickup_location: 'Primary',
  default_weight_g: 450,
  parcel_dims_cm: '25x19x3',
  processing_days_min: 1,
  processing_days_max: 2,
  delivery_days_min: 3,
  delivery_days_max: 7,
  return_window_hours: 48,
  delivery_note: 'Dispatched within 1-2 business days. Delivered safely across India in 3-7 days.',
  free_shipping_note: 'Free shipping on every order today across India.',
  prepaid_offer_text: 'Extra 10% instant off when you pay online via UPI, Cards or Net Banking.',
  coupon_banner_code: 'PY10',
  whatsapp_number: '+919876543210',
  support_email: 'support@pynotes.in',
  social_links: [
    { platform: 'GitHub', url: 'https://github.com' },
    { platform: 'LinkedIn', url: 'https://linkedin.com' },
    { platform: 'Instagram', url: 'https://instagram.com' }
  ],
  footer_about: 'PyNotes makes printed, handwritten coding notes: Python, Java, C and DSA, laid out the way a good student writes them, with shortcuts, diagrams and margin notes.',
  store_address: 'PyNotes HQ, Tech Park, Koramangala, Bengaluru, Karnataka 560034, India',
  payment_icons: ['UPI', 'Visa', 'Mastercard', 'RuPay', 'Net Banking'],
  legal_name: 'PyNotes Edutech Private Limited',
  gstin: '29AABCP1234F1Z5',
  gst_registered: true,
  store_state: 'Karnataka',
  invoice_prefix: 'PYN',
  default_hsn: '4901',
  default_gst_rate_bp: 0,
  tracking_url_template: 'https://shiprocket.co/tracking/{awb}',
  ga4_id: '',
  meta_pixel_id: '',
  hero_slides: [
    {
      desktop_image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
      mobile_image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=600&q=80',
      link: '/subjects',
      title: 'Code, written the way you learn it.',
      subtitle: 'Hand-drawn diagrams, shortcuts & margin notes that textbooks leave out.'
    },
    {
      desktop_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
      mobile_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      link: '/bundles',
      title: 'Master DSA & Full Stack with Printed Notes.',
      subtitle: 'Delivered straight to your doorstep across India.'
    }
  ],
  ticker_items: ['Python', 'Java', 'DSA', 'C++', 'JavaScript', 'SQL', 'React', 'Data Science', 'Operating Systems', 'DBMS'],
  trust_row: [
    { icon: 'BookOpen', title: 'Printed Notes', subtitle: 'Physical books, not digital PDFs' },
    { icon: 'Truck', title: 'Pan-India Shipping', subtitle: 'Fast delivery across 20,000+ pincodes' },
    { icon: 'ShieldCheck', title: 'Secure Checkout', subtitle: 'Razorpay trusted payment gateway' },
    { icon: 'Clock', title: '48-Hr Support', subtitle: 'Easy replacement for transit damage' }
  ],
  usp_blocks: [
    { title: 'Hand-Drawn Clarity', desc: 'Complex pointers and recursion explained with clear visual diagrams.', icon: 'PenTool' },
    { title: 'No Fluff, Just Code', desc: 'Concise syntax notes, interview shortcuts and common pitfalls highlighted.', icon: 'Zap' },
    { title: 'Built by Engineers', desc: 'Structured by top developers who aced interviews at top tech firms.', icon: 'Code' }
  ],
  featured_collection_count: 8,
  default_comparison_rows: [
    { label: 'Format', ours: 'Printed Physical Book', others: 'Digital PDF / E-book' },
    { label: 'Diagrams', ours: 'Hand-drawn color code sketches', others: 'Dry monochrome UML' },
    { label: 'Revisions', ours: 'Optimized for 2-hour exam brush-up', others: '800-page dense reference' },
    { label: 'Margin Notes', ours: 'Student shortcuts & tips', others: 'Strict academic prose' },
    { label: 'Portability', ours: 'A5 spiral bound, desk friendly', others: 'Laptop screen required' }
  ],
  result_stats: [
    { value: '94%', label: 'Exam Score Improvement', sample_size: '1,240 students', source_note: 'Verified student feedback survey', survey_date: 'September 2026' },
    { value: '140+', label: 'Pages per Book', sample_size: '13 core subjects', source_note: 'Complete syllabus coverage', survey_date: 'October 2026' }
  ],
  featured_on_logos: [],
  show_total_orders_badge: true,
  total_orders_badge_min: 50,
  show_low_stock_badge: true,
};

export const defaultSubjects: Subject[] = [
  { slug: 'python', name: 'Python', menu_label: 'Python', icon: 'Code', accent_color: '#12A5B0', seo_intro: 'Complete Python handwritten notes from basics to advanced OOP and async programming.', sort_order: 1, is_active: true },
  { slug: 'java', name: 'Java', menu_label: 'Java', icon: 'Coffee', accent_color: '#0B3561', seo_intro: 'Master Core Java, Collections, Multithreading and JVM architecture with hand-drawn memory maps.', sort_order: 2, is_active: true },
  { slug: 'c', name: 'C Programming', menu_label: 'C', icon: 'Terminal', accent_color: '#3C5D81', seo_intro: 'Pointers, memory management, structures and low-level C programming notes.', sort_order: 3, is_active: true },
  { slug: 'c-plus-plus', name: 'C++', menu_label: 'C++', icon: 'Cpu', accent_color: '#12A5B0', seo_intro: 'STL, OOPs, templates, and competitive programming essentials in C++.', sort_order: 4, is_active: true },
  { slug: 'dsa-with-java', name: 'DSA with Java', menu_label: 'DSA with Java', parent: 'dsa', icon: 'Layers', accent_color: '#0B3561', seo_intro: 'Data Structures and Algorithms implemented cleanly in Java with dry-run diagrams.', sort_order: 5, is_active: true },
  { slug: 'dsa-with-python', name: 'DSA with Python', menu_label: 'DSA with Python', parent: 'dsa', icon: 'GitBranch', accent_color: '#12A5B0', seo_intro: 'Essential algorithms, trees, graphs and dynamic programming in Python.', sort_order: 6, is_active: true },
  { slug: 'javascript', name: 'JavaScript', menu_label: 'JavaScript', icon: 'FileText', accent_color: '#FFD54A', seo_intro: 'Closures, event loop, async/await, DOM manipulation and modern ES6+ notes.', sort_order: 7, is_active: true },
  { slug: 'html', name: 'HTML & CSS', menu_label: 'HTML', icon: 'Layout', accent_color: '#12A5B0', seo_intro: 'Semantic HTML5, Flexbox, Grid, and responsive web design notes.', sort_order: 8, is_active: true },
  { slug: 'css', name: 'CSS Advanced', menu_label: 'CSS', icon: 'Palette', accent_color: '#3C5D81', seo_intro: 'Animations, modern layouts, Tailwind concepts and CSS architecture.', sort_order: 9, is_active: true },
  { slug: 'sql', name: 'SQL & Databases', menu_label: 'SQL', icon: 'Database', accent_color: '#0B3561', seo_intro: 'Joins, indexing, query optimization, transactions and schema design.', sort_order: 10, is_active: true },
  { slug: 'dbms', name: 'DBMS Theory', menu_label: 'DBMS', icon: 'Server', accent_color: '#12A5B0', seo_intro: 'Normalization, ER diagrams, ACID properties and concurrency control.', sort_order: 11, is_active: true },
  { slug: 'operating-system', name: 'Operating Systems', menu_label: 'Operating System', icon: 'HardDrive', accent_color: '#0B3561', seo_intro: 'Process synchronization, CPU scheduling, virtual memory and deadlocks.', sort_order: 12, is_active: true },
  { slug: 'data-science', name: 'Data Science', menu_label: 'Data Science', icon: 'BarChart2', accent_color: '#12A5B0', seo_intro: 'NumPy, Pandas, Matplotlib, Scikit-Learn and data wrangling notes.', sort_order: 13, is_active: true },
];

export const defaultBooks: Product[] = [
  { slug: 'python', title: 'Python Handwritten Notes', subject_slug: 'python', sku: 'PY-BOOK-01', price_paise: 49900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 450, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 37%', sort_order: 1, short_desc: 'Comprehensive, illustrated handwritten notes for Python.', description: 'Detailed handwritten notes covering core concepts, syntax, solved examples, and interview questions for Python. Printed on premium paper with spiral binding.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '140+ Illustrated Pages', body: 'Hand-drawn diagrams and memory hooks.' }], comparison_rows: [] },
  { slug: 'java', title: 'Java Handwritten Notes', subject_slug: 'java', sku: 'JAVA-BOOK-02', price_paise: 49900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 450, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 37%', sort_order: 2, short_desc: 'Comprehensive, illustrated handwritten notes for Java.', description: 'Detailed handwritten notes covering Core Java, Collections, and JVM architecture.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '140+ Illustrated Pages', body: 'Hand-drawn diagrams and memory hooks.' }], comparison_rows: [] },
  { slug: 'c', title: 'C Programming Handwritten Notes', subject_slug: 'c', sku: 'C-BOOK-03', price_paise: 39900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 450, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 50%', sort_order: 3, short_desc: 'Comprehensive, illustrated handwritten notes for C.', description: 'Detailed handwritten notes covering pointers, structs, and low-level memory layout.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '140+ Illustrated Pages', body: 'Hand-drawn diagrams and memory hooks.' }], comparison_rows: [] },
  { slug: 'c-plus-plus', title: 'C++ Handwritten Notes', subject_slug: 'c-plus-plus', sku: 'CPP-BOOK-04', price_paise: 49900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 450, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 37%', sort_order: 4, short_desc: 'Comprehensive, illustrated handwritten notes for C++.', description: 'Detailed handwritten notes covering STL, templates, OOPs, and CP tricks.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '140+ Illustrated Pages', body: 'Hand-drawn diagrams and memory hooks.' }], comparison_rows: [] },
  { slug: 'dsa-with-java', title: 'DSA with Java Handwritten Notes', subject_slug: 'dsa-with-java', sku: 'DSAJ-BOOK-05', price_paise: 59900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 550, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 25%', sort_order: 5, short_desc: 'Comprehensive, illustrated handwritten notes for DSA with Java.', description: 'Complete Data Structures and Algorithms with visual dry-run charts.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '200+ Illustrated Pages', body: 'Hand-drawn dry runs for trees, graphs, and DP.' }], comparison_rows: [] },
  { slug: 'dsa-with-python', title: 'DSA with Python Handwritten Notes', subject_slug: 'dsa-with-python', sku: 'DSAP-BOOK-06', price_paise: 59900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 550, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 25%', sort_order: 6, short_desc: 'Comprehensive, illustrated handwritten notes for DSA with Python.', description: 'Core algorithmic patterns and dynamic programming written in clean Python.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '200+ Illustrated Pages', body: 'Step-by-step trace diagrams.' }], comparison_rows: [] },
  { slug: 'javascript', title: 'JavaScript Handwritten Notes', subject_slug: 'javascript', sku: 'JS-BOOK-07', price_paise: 49900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 450, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 37%', sort_order: 7, short_desc: 'Comprehensive, illustrated handwritten notes for JavaScript.', description: 'Event loop, prototypes, closures, and async JS explained clearly.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '140+ Illustrated Pages', body: 'Visual memory diagrams.' }], comparison_rows: [] },
  { slug: 'html', title: 'HTML & CSS Handwritten Notes', subject_slug: 'html', sku: 'HTML-BOOK-08', price_paise: 49900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 450, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 37%', sort_order: 8, short_desc: 'Comprehensive, illustrated handwritten notes for HTML & CSS.', description: 'Semantic markup, modern layout models, and UI building blocks.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '140+ Illustrated Pages', body: 'Hand-drawn box model & flex diagrams.' }], comparison_rows: [] },
  { slug: 'css', title: 'CSS Advanced Handwritten Notes', subject_slug: 'css', sku: 'CSS-BOOK-09', price_paise: 49900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 450, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 37%', sort_order: 9, short_desc: 'Comprehensive, illustrated handwritten notes for CSS Advanced.', description: 'Complex layouts, animations, transitions, and modern CSS architecture.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '140+ Illustrated Pages', body: 'Visual style guides.' }], comparison_rows: [] },
  { slug: 'sql', title: 'SQL & Databases Handwritten Notes', subject_slug: 'sql', sku: 'SQL-BOOK-10', price_paise: 49900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 450, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 37%', sort_order: 10, short_desc: 'Comprehensive, illustrated handwritten notes for SQL & Databases.', description: 'Query execution, indexing, transactions, and normalization.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '140+ Illustrated Pages', body: 'Visual join charts.' }], comparison_rows: [] },
  { slug: 'dbms', title: 'DBMS Handwritten Notes', subject_slug: 'dbms', sku: 'DBMS-BOOK-11', price_paise: 49900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 450, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 37%', sort_order: 11, short_desc: 'Comprehensive, illustrated handwritten notes for DBMS.', description: 'ACID properties, ER modeling, and concurrency control.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '140+ Illustrated Pages', body: 'Detailed ER diagrams.' }], comparison_rows: [] },
  { slug: 'operating-system', title: 'Operating Systems Handwritten Notes', subject_slug: 'operating-system', sku: 'OS-BOOK-12', price_paise: 49900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 450, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 37%', sort_order: 12, short_desc: 'Comprehensive, illustrated handwritten notes for Operating Systems.', description: 'Process management, scheduling algorithms, paging, and deadlocks.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '140+ Illustrated Pages', body: 'Process state diagrams.' }], comparison_rows: [] },
  { slug: 'data-science', title: 'Data Science Handwritten Notes', subject_slug: 'data-science', sku: 'DS-BOOK-13', price_paise: 49900, mrp_paise: 79900, type: 'book', stock_qty: 50, low_stock_threshold: 5, weight_g: 450, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SAVE 37%', sort_order: 13, short_desc: 'Comprehensive, illustrated handwritten notes for Data Science.', description: 'NumPy, Pandas, statistical modeling, and machine learning pipelines.', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '140+ Illustrated Pages', body: 'Data matrix diagrams.' }], comparison_rows: [] },
];

export const defaultBundles: Product[] = [
  { slug: 'python-java', title: 'Python + Java Bundle', sku: 'BUN-PY-JAVA', price_paise: 89900, mrp_paise: 159800, type: 'bundle', stock_qty: 50, available_qty: 50, low_stock_threshold: 5, weight_g: 900, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SUPER COMBO', sort_order: 1, short_desc: 'Save big with Python + Java combo printed bundle.', description: 'Get complete printed handwritten notes for Python and Java bundled together.', bundle_items: [{ book_slug: 'python', qty: 1 }, { book_slug: 'java', qty: 1 }], images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '2 Full Books', body: 'Complete coverage of OOP & async.' }], comparison_rows: [] },
  { slug: 'c-cplus-python', title: 'C + C++ + Python Bundle', sku: 'BUN-C-CPP-PY', price_paise: 119900, mrp_paise: 239700, type: 'bundle', stock_qty: 50, available_qty: 50, low_stock_threshold: 5, weight_g: 1350, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SUPER COMBO', sort_order: 2, short_desc: 'Save big with C, C++ and Python combo printed bundle.', description: 'Master systems programming and high-level scripting with 3 complete books.', bundle_items: [{ book_slug: 'c', qty: 1 }, { book_slug: 'c-plus-plus', qty: 1 }, { book_slug: 'python', qty: 1 }], images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '3 Full Books', body: 'Low-level memory to high-level syntax.' }], comparison_rows: [] },
  { slug: 'cplus-java-python', title: 'C++ + Java + Python Bundle', sku: 'BUN-CPP-JAVA-PY', price_paise: 129900, mrp_paise: 239700, type: 'bundle', stock_qty: 50, available_qty: 50, low_stock_threshold: 5, weight_g: 1350, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'SUPER COMBO', sort_order: 3, short_desc: 'Top 3 interview languages bundled together.', description: 'Complete printed guides for C++, Java, and Python.', bundle_items: [{ book_slug: 'c-plus-plus', qty: 1 }, { book_slug: 'java', qty: 1 }, { book_slug: 'python', qty: 1 }], images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '3 Full Books', body: 'Covers all campus placement test requirements.' }], comparison_rows: [] },
  { slug: 'c-cplus-java-python', title: 'Complete Programming Combo (4 Books)', sku: 'BUN-ALL-4', price_paise: 159900, mrp_paise: 319600, type: 'bundle', stock_qty: 50, available_qty: 50, low_stock_threshold: 5, weight_g: 1800, hsn_code: '4901', gst_rate_bp: 0, status: 'active', badge_text: 'MEGA SAVER', sort_order: 4, short_desc: 'All 4 foundational coding books in one powerhouse box.', description: 'C, C++, Java, and Python printed handwritten guides.', bundle_items: [{ book_slug: 'c', qty: 1 }, { book_slug: 'c-plus-plus', qty: 1 }, { book_slug: 'java', qty: 1 }, { book_slug: 'python', qty: 1 }], images: ['https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80'], features: [{ heading: '4 Full Books', body: 'The complete software engineering starter library.' }], comparison_rows: [] },
];

export const defaultFaqs: FAQItem[] = [
  { id: 'faq-1', group_name: 'Products', question: 'What is included in PyNotes?', answer: 'PyNotes offers physical, printed handwritten-style coding books complete with diagrams, shortcuts, and margin notes.', sort_order: 1, is_active: true },
  { id: 'faq-2', group_name: 'Products', question: 'Are these digital downloads or physical books?', answer: 'These are 100% physical printed books delivered to your shipping address across India. No digital downloads.', sort_order: 2, is_active: true },
  { id: 'faq-3', group_name: 'Delivery', question: 'How long does delivery take?', answer: 'Orders are processed in 1 to 2 business days and delivered across India in 3 to 7 business days via reliable courier partners.', sort_order: 3, is_active: true },
  { id: 'faq-4', group_name: 'Delivery', question: 'Do you offer Cash on Delivery (COD)?', answer: 'Yes, COD is available across India with a nominal COD fee. COD orders are verified via phone before dispatch.', sort_order: 4, is_active: true },
  { id: 'faq-5', group_name: 'Payment', question: 'What payment methods are accepted?', answer: 'We accept UPI, Credit/Debit Cards, Net Banking, Wallets via Razorpay, as well as Cash on Delivery.', sort_order: 5, is_active: true },
  { id: 'faq-6', group_name: 'Returns', question: 'What if I receive a damaged or wrong item?', answer: 'Damaged or incorrect items must be reported within 48 hours of delivery with photo proof for an instant free replacement.', sort_order: 6, is_active: true },
  { id: 'faq-7', group_name: 'Orders', question: 'Can I cancel my order?', answer: 'Orders can be cancelled anytime before dispatch. Once dispatched, cancellation is no longer available.', sort_order: 7, is_active: true },
  { id: 'faq-8', group_name: 'Invoicing', question: 'Will I get a GST invoice with my order?', answer: 'Yes, every order includes a formal tax invoice with GSTIN and HSN details.', sort_order: 8, is_active: true },
  { id: 'faq-9', group_name: 'Bundles', question: 'How do multi-subject bundles work?', answer: 'Bundles combine multiple subject books at a special discounted combo price. Stock is dynamically managed across individual book inventory.', sort_order: 9, is_active: true },
  { id: 'faq-10', group_name: 'Support', question: 'How can I contact customer support?', answer: 'You can reach us via our support email support@pynotes.in, WhatsApp, or through the contact form on our website.', sort_order: 10, is_active: true },
];

export const defaultPages: PageContent[] = [
  { slug: 'about', title: 'About PyNotes', body_md: '# About PyNotes\n\nPyNotes makes printed, handwritten coding notes designed by top students and engineers. We believe handwriting builds memory and clear diagrams beat dense paragraphs.', is_draft: false, updated_at: new Date().toISOString() },
  { slug: 'privacy-policy', title: 'Privacy Policy', body_md: '# Privacy Policy\n\nDraft: replace with legally reviewed text under India DPDP Act 2023. We protect your phone number, email and shipping address.', is_draft: false, updated_at: new Date().toISOString() },
  { slug: 'terms-of-service', title: 'Terms of Service', body_md: '# Terms of Service\n\nDraft: replace with legally reviewed text. All sales of printed books are subject to our shipping and return guidelines.', is_draft: false, updated_at: new Date().toISOString() },
  { slug: 'refund-policy', title: 'Refund and Return Policy', body_md: '# Refund and Return Policy\n\nDraft: replace with legally reviewed text. Damaged items reported within 48 hours are eligible for replacement.', is_draft: false, updated_at: new Date().toISOString() },
  { slug: 'shipping-policy', title: 'Shipping Policy', body_md: '# Shipping Policy\n\nDraft: replace with legally reviewed text. We ship across India within 3-7 business days.', is_draft: false, updated_at: new Date().toISOString() },
  { slug: 'contact-info', title: 'Contact Information', body_md: '# Contact Information\n\nPyNotes HQ, Koramangala, Bengaluru, Karnataka 560034. Email: support@pynotes.in', is_draft: false, updated_at: new Date().toISOString() },
];

export function getDefaultCatalog() {
  return {
    subjects: defaultSubjects,
    products: [...defaultBooks, ...defaultBundles],
    settings: defaultSettings,
    faqs: defaultFaqs,
    reviews: [
      {
        product_slug: 'python',
        display_name: 'Aditya S.',
        rating: 5,
        title: 'Best Python notes for placement prep',
        body: 'The diagrams for generators, decorators and async were crystal clear. Cleared my interview!',
        status: 'approved'
      },
      {
        product_slug: 'dsa-with-java',
        display_name: 'Pooja M.',
        rating: 5,
        title: 'Tree traversals finally made sense',
        body: 'Dry runs on each page saved me weeks of confusion before semester exams.',
        status: 'approved'
      }
    ]
  };
}

export async function seedDemoDataIfEmpty(actorEmail = 'system@pynotes.in') {
  try {
    const settingsRef = adminDb.collection('settings').doc('site');
    const settingsSnap = await settingsRef.get();

    if (!settingsSnap.exists) {
      await settingsRef.set(defaultSettings);
    }

    for (const sub of defaultSubjects) {
      await adminDb.collection('subjects').doc(sub.slug).set(sub, { merge: true });
    }

    for (const b of defaultBooks) {
      const productRef = adminDb.collection('products').doc(b.slug);
      const snap = await productRef.get();
      if (!snap.exists) {
        await productRef.set(b);
      }
    }

    for (const bun of defaultBundles) {
      const bunRef = adminDb.collection('products').doc(bun.slug);
      const snap = await bunRef.get();
      if (!snap.exists) {
        await bunRef.set(bun);
      }
    }

    const couponRef = adminDb.collection('coupons').doc('PY10');
    const couponSnap = await couponRef.get();
    if (!couponSnap.exists) {
      const couponData: Coupon = {
        code: 'PY10',
        kind: 'percent',
        value: 10,
        min_subtotal_paise: 0,
        applies_to: 'any',
        used_count: 0,
        is_active: true
      };
      await couponRef.set(couponData);
    }

    const faqsSnapshot = await adminDb.collection('faqs').get();
    if (faqsSnapshot.empty) {
      for (const f of defaultFaqs) {
        await adminDb.collection('faqs').add(f);
      }
    }

    for (const p of defaultPages) {
      await adminDb.collection('pages').doc(p.slug).set(p, { merge: true });
    }

    return { success: true, message: 'Demo data seeded successfully!' };
  } catch (err: any) {
    console.warn('Seed operation caught error (using fallback catalog if needed):', err.message);
    return { success: false, warning: err.message };
  }
}
