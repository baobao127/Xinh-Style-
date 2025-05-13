import { SOCIAL_LINKS } from '@/lib/constants';

const instagramPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1550614000-4895a10e1bfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    link: "https://instagram.com/p/example1"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    link: "https://instagram.com/p/example2"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    link: "https://instagram.com/p/example3"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1548549557-dbe9946621da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    link: "https://instagram.com/p/example4"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1566206091558-7f218b696731?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    link: "https://instagram.com/p/example5"
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400",
    link: "https://instagram.com/p/example6"
  }
];

const InstagramFeed = () => {
  return (
    <div className="px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-heading font-bold">Instagram</h2>
        <a 
          href={SOCIAL_LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-sm font-medium flex items-center"
        >
          <span className="mr-1">Theo dõi chúng tôi</span>
          <i className="fab fa-instagram"></i>
        </a>
      </div>
      
      <div className="grid grid-cols-3 gap-1 md:gap-3">
        {instagramPosts.map((post) => (
          <a 
            key={post.id}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="aspect-square overflow-hidden"
          >
            <img 
              src={post.image} 
              alt="Instagram post" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

export default InstagramFeed;
