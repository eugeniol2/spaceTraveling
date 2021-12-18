import next, { GetStaticProps } from 'next';
import { GetStaticPaths } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { AiOutlineCalendar } from 'react-icons/ai';
import { MdPersonOutline } from 'react-icons/md';

import Prismic from '@prismicio/client';
import { useCallback, useEffect, useState } from 'react';
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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState([]);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const handleLoadMore = useCallback(async () => {
    const prismic = getPrismicClient();
    const postsResponse = await fetch(nextPage)
      .then(response => response.json())
      .then(data => {
        setNextPage(data.next_page);
        return data.results;
      })
      .catch(err => {
        console.error(err);
      });
    const results = postsResponse.map(post => {
      return {
        slug: post.uid,
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
        updatedAt: new Date(post.last_publication_date).toLocaleDateString(
          'pt-BR',
          {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          }
        ),
      };
    });

    setPosts(currentPosts => [...currentPosts, ...results]);
    console.log(results);
  }, [nextPage]);

  useEffect(() => {
    setPosts(postsPagination.results);
    console.log('abc');
    console.log(posts);
  }, [postsPagination]);

  return (
    <div className={styles.Container}>
      <div className={styles.Content}>
        <div className={styles.Logo}>
          <img src="/images/Logo.svg" alt="Logo" />
        </div>
        {console.log(`postPagination ===>>>>> ${posts}`)}
        {posts.map(post => (
          <>
            <div className={styles.Post}>
              <Link key={post.slug} href={`/post/${post.slug}`}>
                <a>
                  <h1>{post?.title}</h1>
                  <p>{post?.subtitle}</p>
                </a>
              </Link>
              <div className={styles.PostFooter}>
                <p>
                  <AiOutlineCalendar size="20px" />
                  <span>{post?.updatedAt}</span>
                </p>
                <p>
                  <MdPersonOutline size="20px" />
                  <span>{post?.author}</span>
                </p>
              </div>
            </div>
          </>
        ))}
        {nextPage && (
          <div className={styles.LoadMorePosts}>
            <button onClick={handleLoadMore} type="button">
              Carregar mais posts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      slug: post.uid,
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        'pt-BR',
        {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }
      ),
    };
  });
  console.log(JSON.stringify(postsResponse, null, 2));
  console.log(posts);
  // console.log('abc');
  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page,
      },
    },
    revalidate: 60 * 30,
  };
};
