import "./Loading.css"

type LoadingProps = {
    text?: string
}

const Loading = ({ text }: LoadingProps) => {
    return <>
        <div className="loading w-8 h-8 bg-zinc-600 dark:bg-zinc-300 rounded-md">

        </div>
        {
            text && <p className="font-semibold mt-2 dark:text-zinc-300 text-zinc-600">
                {text}
            </p>
        }
    </>
}

export default Loading