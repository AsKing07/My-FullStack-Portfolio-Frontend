


const nextConfig= {
  /* config options here */
  experimental: {
    // Add supported experimental options here if needed
  },
  images:{
     domains: [
      'github.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com',
      'via.placeholder.com',
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
  },
  //eslint rules
  eslint:{
    //no unescaped entities rule

    ignoreDuringBuilds: true,
  
  }
};

export default nextConfig;
