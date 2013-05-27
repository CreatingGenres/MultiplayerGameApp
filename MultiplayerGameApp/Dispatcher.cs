using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace MultiplayerGameApp
{
    public class Dispatcher : Hub
    {
        private static IDictionary<GameInfo, IList<string>> gamesToBegin =
            new ConcurrentDictionary<GameInfo, IList<string>>();

        private static IDictionary<string, GameInfo> queuedPlayersToGames =
            new ConcurrentDictionary<string, GameInfo>();

        private static IDictionary<string, string> playingPlayers =
            new ConcurrentDictionary<string, string>();

        public void QueueForGame(string gameName, int numberOfPlayers)
        {
            string userId = this.Context.ConnectionId;
            if (playingPlayers.ContainsKey(userId))
            {
                // If the user is already playing another game do something

                return;
            }

            GameInfo game = new GameInfo(gameName, numberOfPlayers);
            if (!gamesToBegin.ContainsKey(game))
            {
                gamesToBegin[game] = new List<string>();
            }
            gamesToBegin[game].Add(userId);
            queuedPlayersToGames[userId] = game;
            TryStartGame(game);
        }

        private bool TryStartGame(GameInfo game)
        {
            if (gamesToBegin[game].Count != game.NumberOfPlayers)
            {
                return false;
            }
            string groupName = game.GenerateGroupName();
            Task[] tasks = new Task[game.NumberOfPlayers];

            for (int i = 0; i < gamesToBegin[game].Count; i++)
            {
                tasks[i] = this.Groups.Add(gamesToBegin[game][i], groupName);
            }
            Task.WaitAll(tasks);

            this.Clients.Group(groupName).gameStarted();

            foreach (string playerId in gamesToBegin[game])
            {
                // Call GAME STARTED
                playingPlayers[playerId] = groupName;
                queuedPlayersToGames.Remove(playerId);
            }

            gamesToBegin.Remove(game);

            return true;
        }

        public void SendToRoom(object data)
        {
            string userId = this.Context.ConnectionId;
            if (!playingPlayers.ContainsKey(userId))
            {
                // the player is not playing anything, what do we do?
                return;
            }
            string groupName = playingPlayers[userId];

            // Call RECEIVE FROM TABLE
            this.Clients.OthersInGroup(groupName).receiveFromRoom(userId, data);
        }

        public override Task OnDisconnected()
        {
            LeaveGame();

            return base.OnDisconnected();
        }

        public void LeaveGame()
        {
            string userId = this.Context.ConnectionId;

            if (playingPlayers.ContainsKey(userId))
            {
                string group = playingPlayers[userId];
                this.Groups.Remove(userId, group);
                this.Clients.Group(group).userLeft(userId);
                playingPlayers.Remove(userId);
            }
            else if (queuedPlayersToGames.ContainsKey(userId))
            {
                // Remove him from the queue.
                var game = queuedPlayersToGames[userId];
                queuedPlayersToGames.Remove(userId);
                gamesToBegin[game].Remove(userId);

                if (gamesToBegin[game].Count == 0)
                {
                    gamesToBegin.Remove(game);
                }
            }
        }
    }

    struct GameInfo : IEquatable<GameInfo>
    {
        private static int Counter = 0;

        public string GameName { get; private set; }
        public int NumberOfPlayers { get; private set; }

        public GameInfo(string name, int numberOfPlayers) : 
            this()
        {
            this.GameName = name;
            this.NumberOfPlayers = numberOfPlayers;
        }

        public bool Equals(GameInfo other)
        {
            return this.GameName == other.GameName && this.NumberOfPlayers == other.NumberOfPlayers;
        }

        public static bool operator ==(GameInfo first, GameInfo second)
        {
            return first.Equals(second);
        }

        public static bool operator !=(GameInfo first, GameInfo second)
        {
            return !first.Equals(second);
        }

        public string GenerateGroupName()
        {
            // Counter instead of GUID since this means smaller group name => less trafic
            string group = string.Format("{0}_{1}_{2}", this.GameName, this.NumberOfPlayers, Counter++);

            return group;
        }
    }
}