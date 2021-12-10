import { GetStaticProps } from 'next';
import Image from 'next/image';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import Post from './post/[slug]';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <div className={styles.Logo}>
          <img src="/images/Logo.svg" alt="Logo" />
        </div>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <div className={styles.LoadMorePosts}>
          <button onClick={() => console.log('click')} type="button">
            Carregar mais posts
          </button>
        </div>
      </div>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);
//   // TODO
// };
