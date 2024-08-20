# React Apple Tree

React Apple Tree is an updated version of the popular library react-sortable-tree.

## Installation

To install React Apple Tree, you can use npm or yarn:

```bash
npm install react-apple-tree
```

or

```bash
yarn add react-apple-tree
```

## Local Testing

To test React Apple Tree locally, follow these steps:

1. Clone the repository by running the following command in your terminal:

    ```bash
    git clone https://github.com/Newton-School/react-apple-tree.git
    ```

2. Navigate to the project directory:

    ```bash
    cd react-apple-tree
    ```

3. Install the project dependencies using npm:

    ```bash
    npm install
    ```

4. Start the development server and watch for changes:

    ```bash
    npm run watch
    ```

5. Go to `src/components/topicTree/TopicTree.js` file in `newton-web` repository and do following changes.

    ```jsx
    const ReactAppleTree = dynamic(() => import('react-apple-tree'), {
        ssr: false,
    });
    ```

6. Now use `ReactAppleTree` instead of `SortableTree`