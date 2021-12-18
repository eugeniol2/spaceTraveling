import { GetStaticPaths, GetStaticProps } from 'next';
import { AiOutlineCalendar } from 'react-icons/ai';
import { MdPersonOutline } from 'react-icons/md';

import Prismic from '@prismicio/client';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  updatedAt: string | null;
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

export default function Post({ post }: PostProps): JSX.Element {
  console.log('post abaixo');
  console.log(JSON.stringify(post, null, 2));
  console.log(post?.data.banner);
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Head>
        <title>{post.data.title}</title>
      </Head>
      <div className={styles.Container}>
        <div className={styles.Image}>
          <img src={`${post.data.banner.url}`} alt="banner" />
        </div>
        <div className={styles.Post}>
          <h1>{post.data.title}</h1>
          <div className={styles.PostFooter}>
            <p>
              <AiOutlineCalendar size="20px" /> <span>{post.updatedAt}</span>
            </p>
            <p>
              <MdPersonOutline size="20px" /> <span>{post.data.author}</span>
            </p>
          </div>
          <div className={styles.Content}>
            <section>
              <p>
                <h1>Generic excerpt title</h1>
                {post.data.content[0].heading}
              </p>
              <p>
                <h1>Generic content title</h1>
                {post.data.content[0].body[0].text}
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async (): Promise<any> => {
  const prismic = getPrismicClient();
  const data = await prismic.query(
    Prismic.Predicates.at('document.type', 'post')
  );

  const paths = data.results.map(post => ({
    params: { slug: post.uid },
  }));

  return { paths, fallback: true };
};

export const getStaticProps = async (context): Promise<any> => {
  const { slug } = context.params;
  console.log(context);
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});
  console.log('response');
  console.log(response);

  const post = {
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: {
        ...response.data.content,
      },
    },
  };

  return {
    props: {
      post,
    },
  };
};
