export const formatTimeStamp = (timeStamp) =>
    {
        const date  = new Date(timeStamp.toMillis());
        return `${date.toLocaledateString()} ${date.toLocaledateString()}`;
    };

    export const generatekey = () =>{
        return Math.random().toString(36).substr(2,10);
    }

    export const sortMessagesByTimeStamp = (messages) =>{
        return messages.sort(
             (a, b) => a.timestamp.toMillis()
            -
           
            b.timestamp.toMillis()
            
            );
            
            };
    