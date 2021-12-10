import { GetStaticPaths, GetStaticProps } from 'next';
import { AiOutlineCalendar } from 'react-icons/ai';
import { MdPersonOutline } from 'react-icons/md';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post(): JSX.Element {
  return (
    <div className={styles.Post}>
      <h1>Como utilizar hooks</h1>
      <p>Pensando em sincronização em vez de ciclos de vida</p>
      <div className={styles.PostFooter}>
        <p>
          <AiOutlineCalendar size="20px" /> <span>15 mar 2021</span>
        </p>
        <p>
          <MdPersonOutline size="20px" /> <span>joseph oliveira</span>
        </p>
      </div>
    </div>
  );
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient();
//   const posts = await prismic.query(TODO);

//   // TODO
// };

// export const getStaticProps = async context => {
//   const prismic = getPrismicClient();
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
