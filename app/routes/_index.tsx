import { useState } from 'react';
import type { V2_MetaFunction } from "@remix-run/cloudflare";
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

type Book = {
  title: string;
  genre: string;
}
type Books = Array<Book>;
type LoaderData = {
  books: Books;
}

export const loader = async () => {
  return json<LoaderData>({
    books: [
      {
        title: 'Harry Potter and the Deathly Hallows',
        genre: "Children's Fiction",
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        genre: "Children's Fiction",
      },
    ],
  });
};

export default function Index() {
  const { books } = useLoaderData() as LoaderData;
  const [count, setCount] = useState(0);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="text-3xl font-bold underline">
        Welcome to Remix
      </h1>
      <p>{count}</p>
		  <button onClick={() => setCount(count + 1)}>Increment</button>
		  <button onClick={() => setCount(count - 1)}>Decrement</button>
      <ul>
      {books.map(({ title, genre }, i) => {
          return (
            <li key={i}>
              <h3> {title} </h3>
              <p> {genre} </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
